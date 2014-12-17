#Index

**Modules**

* [Layout](#module_Layout)
  * [Layout~_allocateIds(layoutComponent)](#module_Layout.._allocateIds)
  * [Layout~_getLayoutComponentById(id, parent)](#module_Layout.._getLayoutComponentById)
  * [Layout~_updateLayoutComponentData(id, binding)](#module_Layout.._updateLayoutComponentData)
  * [Layout~_removeLayoutComponentFromLayout(id)](#module_Layout.._removeLayoutComponentFromLayout)
  * [Layout~_moveLayoutComponent(id, toId)](#module_Layout.._moveLayoutComponent)
  * [Layout~_addLayoutComponent(parentId, layoutComponentType)](#module_Layout.._addLayoutComponent)
  * [Layout~_layoutComponentIsRoot(id)](#module_Layout.._layoutComponentIsRoot)
* [LayoutComponent](#module_LayoutComponent)
  * [LayoutComponent~_canEdit()](#module_LayoutComponent.._canEdit)
  * [LayoutComponent~_canRemove()](#module_LayoutComponent.._canRemove)
  * [LayoutComponent~_createChildLayoutComponents()](#module_LayoutComponent.._createChildLayoutComponents)
  * [LayoutComponent~_allowDrop()](#module_LayoutComponent.._allowDrop)
  * [LayoutComponent~_nodeBelongsToLayoutComponent(node)](#module_LayoutComponent.._nodeBelongsToLayoutComponent)
  * [LayoutComponent~_handleDragStart()](#module_LayoutComponent.._handleDragStart)
  * [LayoutComponent~_hasAncestor(id)](#module_LayoutComponent.._hasAncestor)
  * [LayoutComponent~_handleDrop()](#module_LayoutComponent.._handleDrop)
  * [LayoutComponent~_getLayoutComponentSchema()](#module_LayoutComponent.._getLayoutComponentSchema)
* [Palette](#module_Palette)
* [PaletteComponent](#module_PaletteComponent)
  * [PaletteComponent~_handleDragStart()](#module_PaletteComponent.._handleDragStart)
* [Workspace](#module_Workspace)
 
<a name="module_Layout"></a>
#Layout
A Layout is made up of one or more LayoutComponents.

**Members**

* [Layout](#module_Layout)
  * [Layout~_allocateIds(layoutComponent)](#module_Layout.._allocateIds)
  * [Layout~_getLayoutComponentById(id, parent)](#module_Layout.._getLayoutComponentById)
  * [Layout~_updateLayoutComponentData(id, binding)](#module_Layout.._updateLayoutComponentData)
  * [Layout~_removeLayoutComponentFromLayout(id)](#module_Layout.._removeLayoutComponentFromLayout)
  * [Layout~_moveLayoutComponent(id, toId)](#module_Layout.._moveLayoutComponent)
  * [Layout~_addLayoutComponent(parentId, layoutComponentType)](#module_Layout.._addLayoutComponent)
  * [Layout~_layoutComponentIsRoot(id)](#module_Layout.._layoutComponentIsRoot)

<a name="module_Layout.._allocateIds"></a>
##Layout~_allocateIds(layoutComponent)
Recursivly allocate id's to a LayoutComponent. LayoutComponents with an existing id are ignored.

**Params**

- layoutComponent `Object` - The field you wish to assign an id to.  

**Scope**: inner function of [Layout](#module_Layout)  
**Returns**: `Object` - The updated LayoutComponent.  
<a name="module_Layout.._getLayoutComponentById"></a>
##Layout~_getLayoutComponentById(id, parent)
**Params**

- id `String` - The id of the LayoutComponent you're looking for  
- parent `Object` - The LayoutComponent to check against (if undefined, starts from root)  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._updateLayoutComponentData"></a>
##Layout~_updateLayoutComponentData(id, binding)
Update the Layout's state with new LayoutComponent data.

**Params**

- id `String` - The id of the LayoutComponent you want to update.  
- binding `Object` - The new value of the LayoutComponent.  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._removeLayoutComponentFromLayout"></a>
##Layout~_removeLayoutComponentFromLayout(id)
Revomes a LayoutComponent and all of it's children from the Layout.

**Params**

- id `String` - The ID of the LayoutComponent to remove.  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._moveLayoutComponent"></a>
##Layout~_moveLayoutComponent(id, toId)
Move a LayoutComponent to a new parent.

**Params**

- id `String` - The ID of the LayoutComponent that's getting moved.  
- toId `String` - Parent we're moving the LayoutComponent to.  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._addLayoutComponent"></a>
##Layout~_addLayoutComponent(parentId, layoutComponentType)
Add a workspce field to the Workspace.

**Params**

- parentId `String` - ID of the LayoutComponent we're adding the new LayoutComponent to.  
- layoutComponentType `String` - Type of LayoutComponent we're adding.  

**Scope**: inner function of [Layout](#module_Layout)  
**Returns**: `String` - ID of the new LayoutComponent.  
<a name="module_Layout.._layoutComponentIsRoot"></a>
##Layout~_layoutComponentIsRoot(id)
Determine if a LayoutComponent is the root component.

**Params**

- id `String` - The id of the LayoutComponent we're checking.  

**Scope**: inner function of [Layout](#module_Layout)  
**Returns**: `Boolean`  
<a name="module_LayoutComponent"></a>
#LayoutComponent
The core component used to create layouts.

**Members**

* [LayoutComponent](#module_LayoutComponent)
  * [LayoutComponent~_canEdit()](#module_LayoutComponent.._canEdit)
  * [LayoutComponent~_canRemove()](#module_LayoutComponent.._canRemove)
  * [LayoutComponent~_createChildLayoutComponents()](#module_LayoutComponent.._createChildLayoutComponents)
  * [LayoutComponent~_allowDrop()](#module_LayoutComponent.._allowDrop)
  * [LayoutComponent~_nodeBelongsToLayoutComponent(node)](#module_LayoutComponent.._nodeBelongsToLayoutComponent)
  * [LayoutComponent~_handleDragStart()](#module_LayoutComponent.._handleDragStart)
  * [LayoutComponent~_hasAncestor(id)](#module_LayoutComponent.._hasAncestor)
  * [LayoutComponent~_handleDrop()](#module_LayoutComponent.._handleDrop)
  * [LayoutComponent~_getLayoutComponentSchema()](#module_LayoutComponent.._getLayoutComponentSchema)

<a name="module_LayoutComponent.._canEdit"></a>
##LayoutComponent~_canEdit()
Returns true if the user is able to edit the field.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Boolean`  
<a name="module_LayoutComponent.._canRemove"></a>
##LayoutComponent~_canRemove()
Returns true if the user is able to remove the LayoutComponent from the Layout.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Boolean`  
<a name="module_LayoutComponent.._createChildLayoutComponents"></a>
##LayoutComponent~_createChildLayoutComponents()
Create the child components for the current WorkspaceField.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Array` - Child layout fields of the current WorkspaceField.  
<a name="module_LayoutComponent.._allowDrop"></a>
##LayoutComponent~_allowDrop()
By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
<a name="module_LayoutComponent.._nodeBelongsToLayoutComponent"></a>
##LayoutComponent~_nodeBelongsToLayoutComponent(node)
Check if a DOM node is part of a WorkspaceField.

**Params**

- node `Object` - A DOM node  

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Boolean`  
<a name="module_LayoutComponent.._handleDragStart"></a>
##LayoutComponent~_handleDragStart()
Handle the drag event on a LayoutComponent

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
<a name="module_LayoutComponent.._hasAncestor"></a>
##LayoutComponent~_hasAncestor(id)
Check if the current LayoutComponent has an ancestor matching an ID.

**Params**

- id `String`  

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
<a name="module_LayoutComponent.._handleDrop"></a>
##LayoutComponent~_handleDrop()
Handle the drop event of a LayoutComponent.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
<a name="module_LayoutComponent.._getLayoutComponentSchema"></a>
##LayoutComponent~_getLayoutComponentSchema()
Get the schema for the LayoutComponent.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Array` - The schemas relating to a LayoutComponent.  
<a name="module_Palette"></a>
#Palette
Wrapper component for the available fields.

<a name="module_PaletteComponent"></a>
#PaletteComponent
A PalettleComponent can be dragged onto a Layout, creating a LayoutComponent.

<a name="module_PaletteComponent.._handleDragStart"></a>
##PaletteComponent~_handleDragStart()
Handle the drag event on PaletteField's

**Scope**: inner function of [PaletteComponent](#module_PaletteComponent)  
<a name="module_Workspace"></a>
#Workspace
Workspace is the base component of NeoLayout.

