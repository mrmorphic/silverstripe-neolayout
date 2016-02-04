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
 *  The NLView uses a layout manager which maps the logical layout concepts
    to an implementation. The module contains a manager for bootstrap.

Layout representation
---------------------

One of the most important characteristics of this module is the layout representation. A layout is
a hierarchical data structure of objects. Typically, a layout is persisted by saving it as a JSON
string, although that is secondary to the structure itself. Notably, this structure is manipulated
both server side and client side.

(It is intended that there may in the future be additional server-side implementations that use the same
structure and rendering, and may use the same client side layout editor. For this reason, the layout structure
is not strictly SilverStripe dependent.)

Each object in the hierarchy has the following properties:

 *  componentType       a string that identifies the type of component. Type names are determined
                        server side, as the server understands the rendering of these components. (this
                        used to be called ClassName, as the module uses the component's ClassName
                        to identify the component type)
 *  id                  a unique ID of the component within the layout. The module generates GUID values.
 *  children            an array of child objects
 *  bindings            an object with key/value pairs, where the key is the name of a published property
                        of the component, and the value is an object with 'type' and 'value' properties.
                        'type' is either 'embedded' or 'context'. 'value' representation depends on the
                        published data type of the property in the component. (The data type itself is not
                        stored in the layout).
 *  layout              an object that contains properties that the layout manager uses to position this
                        component within it's parent and relative to it's siblings. The properties are
                        layout manager-specific. While bindings contains values that component understands,
                        'layout' contains values the layout manager understands.
 *  _*                  property names starting with underscore are considered "hints". They are not guaranteed
                        to be persisted, so components should not rely on this, but use bindings instead. Hints
                        are frequently used by the server to augment metadata to a component for the CMS editor,
                        or within the editor itself for internal use (e.g. _parent).

All other property names are reserved, and there should be no expected behaviour, including whether or not the
property is persisted.
    
Typically, the top-level component is an NLLayoutContainer.

Things you need to be aware of
------------------------------

 *  It is possible to build a layout that contains primary content, but this is not generally an intended pattern.
    Rather, content and other managed information should still be created using DataObjects, with the layout
    referring to the data structure. Content editors may need to support from you to understand that content should
    still be edited at the page/data object level.
 *  If a layout is embedded on a page (as NLEditableLayoutPage does), the layout is versioned with the page. However,
    if components are defined in the database, which are referred to in components or bound to, changes in these objects
    may update on live immediately, unless versioning is explicitly managed with these objects.

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