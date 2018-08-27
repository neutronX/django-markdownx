# -*- coding: utf-8 -*-

"""
usage: dev.py [-h] (-v | -d | -c | -run-vagrant | -run-docker | -no-container)
              [--with-docs] [--with-npm-settings]

optional arguments:
  -h, --help           show this help message and exit
  -v, --vagrant        Install Vagrant development environment (requires
                       Vagrant).
  -d, --docker         Install Docker development environment (requires
                       Docker).
  -c, --clean          Clean up the development files (only the ones that have
                       been automatically created).
  -run-vagrant         Run vagrant development environment (runs --vagrant if
                       the files don't already exist). Vagrant must be
                       installed on your machine.
  -run-docker          Run vagrant development environment (runs --vagrant if
                       the files don't already exist). Docker must already be
                       installed on your machine, and Docker Daemon must be up
                       and running.
  -no-container        Run vagrant development environment (runs --vagrant if
                       the files don't already exist).
  --with-docs          Install documentation development environment.
  --with-npm-settings  Install npm installation environment for front-end
                       (TypeScript) development (requires node.js and npm).

Copyright (c) 2017, Django MarkdownX - Adi, Pouria Hadjibagheri.
"""

# Python's internal libraries:
from __future__ import unicode_literals
from os.path import join as join_path, dirname, abspath, exists, splitext
from os import remove, chmod, stat
from stat import S_IEXEC
from sys import executable as python_path
from sys import exit as sys_exit

# Third party libraries:
try:
    from pip._internal import main as pip_main
except ImportError:  # pip < 10
    from pip import main as pip_main


BASE_DIR = dirname(abspath(__file__))
DEV_XML_FILE = 'dev.xml'
XML_FILE_ABSOLUTE_PATH = join_path(BASE_DIR, DEV_XML_FILE)

pypi_packages = {
    'sphinx',
    'sphinx-classy-code',
    'sphinxcontrib-autoanysrc',
}


bash_commands = {
    'vagrant': (
        'cd {path}'.format(path=BASE_DIR),
        'vagrant up',
        'vagrant ssh -c "/home/vagrant/.virtualenvs/django-markdownx/bin/python -u '
        '/srv/django-markdownx/manage.py runserver 0.0.0.0:8000"'
    ),
    'docs': (
        'cd {}'.format(join_path(BASE_DIR, 'docs-src', '_theme', 'sphinx_rtd_theme')),
        '{python} setup.py clean install'.format(python=python_path),
        'cd ../..'
    ),
    'docker': (
        'docker-compose build',
        'docker-compose up -d'
    )
}


def quiz(question, options, max_attempts=3):
    from collections import Counter

    count = Counter([item[0] for item in options])
    if max(count.values()) > 1:
        raise ValueError(
            'Multiple options start with '
            'character "{}".'.format(max(count, lambda x: count[x]))
        )

    current_attempt = 0
    opts = tuple(key[0] for key in options)
    opts_str = str.join(
        ', ',
        ('[{}]{}'.format(key, options[index][1:]) for index, key in enumerate(opts))
    )
    while current_attempt < max_attempts:
        try:
            response = input(
                '> {question}\n'
                '  {opts} (ctrl+c to cancel): '.format(question=question, opts=opts_str)
            )

            if response.strip() in opts:
                return options[opts.index(response.strip())]

            print('\nInvalid response.')
            current_attempt += 1
        except KeyboardInterrupt:
            print('\nOperation cancelled by the user. Exited with code 0.')
            sys_exit(0)
    else:
        print(
            '\nFailed {} attempts. Operation cancelled, '
            'exited with code 1.'.format(max_attempts)
        )
        sys_exit(1)


def yes_no_quiz(question, max_attempts=3):
    response = quiz(
        question=question,
        options=('Yes', 'No'),
        max_attempts=max_attempts
    )
    return response == 'Yes'


def replace_contents_or_not(path):
    replace_response = 'override and update the default'

    replace_or_override = dict(
        question='Contents of the existing "{}" and default values don\'t match. '
                 'Would you like to...\n'.format(path),
        options=(
            'override and update the default',
            'replace changes with the default'
            )
    )
    return quiz(**replace_or_override) == replace_response


def from_terminal(subject):
    from subprocess import run as run_bash
    from shlex import split as shlex_split

    for command in bash_commands[subject]:
        print('> EXECUTING:', command)
        run_bash(shlex_split(command), timeout=None, check=True)
    return True


def create_files(name):
    from xml.etree.ElementTree import parse
    from xml.sax.saxutils import escape, unescape

    contents_xml = parse(XML_FILE_ABSOLUTE_PATH)
    root = contents_xml.getroot()

    for file in root:
        if name in file.attrib['for'].split(';'):
            relative_path = [node.text for node in file.iterfind('path')]
            absolute_path = join_path(BASE_DIR, *relative_path)

            display_path = join_path('markdownx', *relative_path)
            template_contents = file.find('contents').text

            if exists(absolute_path):
                with open(absolute_path, mode='r') as data_file:
                    file_io = data_file.read()

                contents_identical = template_contents.strip() == escape(file_io.strip())

                if not contents_identical and replace_contents_or_not(display_path):
                    file.find('contents').text = escape(file_io)
                elif not contents_identical:
                    with open(absolute_path, mode='w') as file_io:
                        file_io.write(unescape(template_contents) + '\n')

                    print('> REPLACED with default:', display_path)
            else:
                with open(absolute_path, mode='w') as target_file:
                    target_file.write(unescape(template_contents))

                print('> CREATED:', display_path)

            if splitext(absolute_path)[1] == '.sh' or absolute_path.endswith('manage.py'):
                st = stat(absolute_path)
                chmod(absolute_path, st.st_mode | S_IEXEC)

        contents_xml.write(
            file_or_filename=XML_FILE_ABSOLUTE_PATH,
            xml_declaration=True,
            encoding='UTF-8',
            method='xml'
        )

    return True


def delete(abs_path, disp_path):
    try:
        remove(abs_path)
    except IOError as error:
        print('Failed to delete "{}"\n'.format(disp_path), error)

    print('> REMOVED:', disp_path)
    return True


def clean():
    response = yes_no_quiz(
        question="Are you sure you want to clean up "
                 "the developers' environment?"
    )
    if not response:
        print('Exited at user\'s request with code 0.')
        sys_exit(0)

    from xml.etree.ElementTree import parse
    from xml.sax.saxutils import escape

    contents_xml = parse(XML_FILE_ABSOLUTE_PATH)
    root = contents_xml.getroot()

    for file in root:
        relative_path = [node.text for node in file.iterfind('path')]
        absolute_path = join_path(BASE_DIR, *relative_path)
        display_path = join_path('markdownx', *relative_path)

        if not exists(absolute_path):
            continue

        with open(absolute_path, mode='r') as data_file:
            file_content = data_file.read()

        if file.find('contents').text.strip() == escape(file_content.strip()):
            delete(absolute_path, display_path)
            continue

        if replace_contents_or_not(display_path):
            file.find('contents').text = escape(file_content)
            print('> UPDATED in default setting:', display_path)
            delete(absolute_path, display_path)
            continue

        delete(absolute_path, display_path)

    delete(join_path(BASE_DIR, 'db.sqlite3'), 'db.sqlite3')

    contents_xml.write(
        file_or_filename=XML_FILE_ABSOLUTE_PATH,
        xml_declaration=True,
        encoding='UTF-8',
        method='xml'
    )

    return True


def docs():
    subject = 'docs'
    create_files(subject)
    pip_install(*pypi_packages)
    return from_terminal(subject)


def vagrant():
    subject = 'vagrant'
    return create_files(subject)


def run_vagrant():
    subject = 'vagrant'
    vagrant()
    return from_terminal(subject)


def docker():
    subject = 'docker'
    return create_files(subject)


def run_docker():
    subject = 'docker'
    docker()
    return from_terminal(subject)


def npm():
    subject = 'npm'
    return create_files(subject)


def no_container():
    subject = 'no-container'
    return create_files(subject)


def pip_install(*packages):
    for package in packages:
        pip_main(['install', package])
    return True


def main():
    import argparse
    from datetime import datetime
    parser = argparse.ArgumentParser(
        description='Welcome to Django MarkdownX Developers\' Environment.',
        epilog=(
            "Copyright (c) {}, Django MarkdownX - "
            "Adi, Pouria Hadjibagheri.".format(
                datetime.now().strftime('%Y')
            )
        )
    )

    group = parser.add_mutually_exclusive_group(required=True)

    group.add_argument(
        '-v',
        '--vagrant',
        action='store_const',
        const=vagrant,
        dest='run',
        help='Install Vagrant development environment (requires Vagrant).'
    )

    group.add_argument(
        '-d',
        '--docker',
        action='store_const',
        dest='run',
        const=docker,
        help='Install Docker development environment (requires Docker).'
    )

    group.add_argument(
        '-c',
        '--clean',
        action='store_const',
        const=clean,
        dest='run',
        help='Clean up the development files (only the ones that '
             'have been automatically created).'
    )

    group.add_argument(
        '-run-vagrant',
        action='store_const',
        dest='run',
        const=run_vagrant,
        help='Run vagrant development environment '
             '(runs --vagrant if the files don\'t already exist). '
             'Vagrant must be installed on your machine.'
    )

    group.add_argument(
        '-run-docker',
        action='store_const',
        dest='run',
        const=run_docker,
        help='Run docker development environment '
             '(runs --docker if the files don\'t already exist). '
             'Docker must already be installed on your machine, and '
             'Docker Daemon must be up and running.'
    )

    group.add_argument(
        '-no-container',
        action='store_const',
        dest='run',
        const=no_container,
        help='Create development files without a container-based '
             'development environment (creates "manage.py" and "runtests.py").'
    )

    parser.add_argument(
        '--with-docs',
        action='store_const',
        const=docs,
        dest='run',
        help='Install documentation development environment.'
    )

    parser.add_argument(
        '--with-npm-settings',
        action='store_const',
        const=npm,
        dest='run',
        help='Install npm installation environment for front-end '
             '(TypeScript) development (requires node.js and npm).'
    )

    parser.parse_args().run()

    return parser


if __name__ == '__main__':
    main()
