About Neolayout
===============

Neolayout aims to be a flexible mechanism for providing layout of components, and assembling page types using a combination of regular templates and such layouts. This can be most closely likened to the widgets provided by silverstripe-widgets module, but neolayout is alot more flexible in how layouts are set up, and how components can interact with their execution environment.

Concepts
--------

 *  An NLView is a controller that renders a layout within some context,
    often a page.
 *  A layout is made up of NLComponent derivatives. Components can be nested.
 *  There are layout components and non-layout components. The basic layout
    component is a box, which renders it's child components vertically or
    horizontally.
 *  A layout can be constructed programmatically, but is more typically either:
     -  serialised into the database using the NLCMSLayoutEditorField, which
        for example can be added to a page so that CMS editors can configure
        what components are shown in the view, and how those components are
        set up.
     -  saved to the file system, which can be useful when a layout is defined
        by a developer and is managed under source code control.
 *  When a layout is rendered, it is within a context, usually a page.
    Properties of components can be bound to methods or properties of the
    containing context.

Requirements
============

Neolayouts requires SilverStripe 3.2 or higher.

Installation
============
 *  Run `npm install` from the module's root directory. This will download all
    front-end dependencies and bundle the app for you.

Configuration
=============
 * Run `npm run build` to build the front-end application.