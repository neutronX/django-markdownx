# Installation

## Using PIP

Django MarkdownX may be installed directly using Python Package Index (PyPi):

```bash
pip install django-markdownx
```

`request.user` must be available via some middleware if you wish to restrict
uploads to logged-in users via the `MARKDOWNX_UPLOAD_ALLOW_ANONYMOUS` setting.
Most likely, you are using `django.contrib.auth.middleware.AuthenticationMiddleware`
already, which sets this attribute.

## From the source

Should you wish to download and install it using the source code, you can do as follows:

!!! note
	Make sure you have activated your virtual environment if you’re using one.
	
We start off by downloading the source code from GitHub and navigate to the downloaded directory:

```bash
git clone https://github.com/neutronX/django-markdownx.git
cd django-markdownx/
```

Install the package.

```bash
python3 setup.py install
```
