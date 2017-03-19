# Wyrm

Built primarily by Dave Snider for use on his web sites. Here be documentation
for the poor souls that have to work with him and wonder why he doesn't just
use bootstrap.

Wyrm is a small library of [Bourbon](http://bourbon.io) powered SASS files meant
for use in minimalistic Document and Form heavy sites. It was primarily built
for [Webhook](http://www.webhook.com) but can also be found in use on
[Read the Docs sphinx theme](http://snide.github.com/sphinx_rtd_theme) among
other places.

## Installation

Wyrm is best installed through [bower](http://bower.io) and is updated regularly.

```
bower install wyrm
```

By default, Wyrm installs [Font Awesome](http://fontawesome.io) setting the
`$icon-prefix` to FA's default of `fa`. You'll want to use [Grunt](http://gruntjs.org)
or some other method to copy the font files to your font folder in your project. Wyrm
by default assumes that it is `../fonts/` relative to your css, but this variable can
be changed with `$fa-font-path`. You can use any font icons though, and all icons
actually used in Wyrm itself are set as variables in the `_wy_variables.sass` files.

## Things to know

1. Uses indented Sass style because it's awesome.
2. `$base-line-height` is the magic number used for calculations across wyrm. `$gutter` is
it's em based cousin usefual for grids.
4. Because `$gutter` is an em value, I've included an `em()` mixin for converting pixels
to ems should you need to make calculations with the two.
3. Vertical margin is only applied to the **bottom** of elements, not spread
top/bottom like other frameworks. It is always some multiple of `$base-line-height`

## Wyrm core / add-on structure

Files that you'll likely want to install are in `/wyrm_core/` and you can handly call
all of them using the `_wyrm_core.sass` file. Alternatively, I've built a whole lot
of addons, located in `/wym_addons/`, which you can plug and play into wyrm as you need. Most of them are
documented here. To install core + plus all the addons, there's a handy `_wyrm_all.sass`
file, though honestly you'll prolly just make your own document at that point.
