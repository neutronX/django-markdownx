# Instructions

Using the existing settings, documentations can only be compiled on a 
Unix based machine (OS X or Linux). They can also be compile on 
windows, however, a different set of settings will be required, which 
is not included. 


Start off by installing the requirements:

```bash
$ python3 -m pip install sphinx sphinx-classy-code sphinxcontrib-autoanysrc 
```

or navigate to `./django-markdownx/docs/src` and run:

```bash
$ python3 -m pip install -r requirements.txt
```

then:

```bash
$ cd docs/src/_theme/sphinx_rtd_theme
$ python3 -m setup.py install
```

Once done run this to compile the docs:

```bash
$ cd ../..
$ chmod +x create_docs.sh
$ ./create_docs.sh
```

The docs will now be in `./django-markdownx/docs/build/html`. To check 
them out, open `index.html` in your browser. 