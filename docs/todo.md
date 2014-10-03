# Use cases

Some example use cases:
- Want a component to only show sometimes. Visibility is controlled by binding.
- I have a map with my store locations, that comes from data I set up in the CMS. When someone clicks a location
  on map, I want another component to change to show details. When nothing is selected, I want a place holder image
  to show, that has some marketing info, and tells the user to click on a store. Both store and default panels
  have buttons and links to other parts of the site, like sign-up.
- I want a hero panel that moves between images that I upload to the CMS.
- I want the area on my page to be fixed in size, and constrain components within it
- I want the area on my page to automatically adjust in size depending on the compnents I put in it.
- I want to be able to select a model from a list or a set of options, and have that display in web GL automatically,
  with no page re-load.

# Features

## MVP

 *  layout editor in CMS:
     -  supports vertical box default, split to create horizontal box.
 *  edit component properties in CMS.
 *  binding to page.
 *  Add components to a layout, with visual marker of where component will
    be dropped.
 *  Load layout from file instead of database. NLView works the same way,
    as does the binding.
 *  Form support - a component can include a form, and the view can route
    to it.

## Nice to have

 *  Ability to define a layout template, so configured layouts can be applied
    to different pages.
 *  Copy-and-paste of layouts

## Experimental

 *  Container whose children are computed dynamically from the context, or
    possibly just a nested NLView that is computed somehow.
 *  A container that maps items in a dynamic collection, and repeats the
    contained components for each one. Implies that the children are passed
    the item in their (extended) context, but still want parent context.
 *  Layout states. e.g to support a mobile-specific view. Note this could be
    achieved
 *  Conditional display of components.

# Components

## Essential

 *  Link
 *  Text (rich/plain), including shortcodes etc.
 *  Box - horizontal, vertical
 *  Map - google maps, with markers bound from collection

## Nice to have

 *  Table layout - a layout where all rows have the same number of
    columns. Possibly a special case of Box.
 *  Image carousel
 *  Tabs container
 *  Video player
 *  Login/logout
 *  Sidebar
 *  Personalisation
 *  Advertisement - could be a subset of personalisation
