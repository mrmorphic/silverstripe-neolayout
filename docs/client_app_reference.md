#Index

**Modules**

* [Layout](#module_Layout)
  * [Layout~_getComponentById(id, parent)](#module_Layout.._getComponentById)
  * [Layout~_updateComponent(id, binding)](#module_Layout.._updateComponent)
  * [Layout~_removeComponent(id)](#module_Layout.._removeComponent)
  * [Layout~_moveComponent(id, toId)](#module_Layout.._moveComponent)
  * [Layout~_addComponent(parentId, componentType)](#module_Layout.._addComponent)
  * [Layout~_componentIsRoot(id)](#module_Layout.._componentIsRoot)
* [LayoutComponent](#module_LayoutComponent)
  * [LayoutComponent~_canEdit()](#module_LayoutComponent.._canEdit)
  * [LayoutComponent~_canRemove()](#module_LayoutComponent.._canRemove)
  * [LayoutComponent~_createChildComponents()](#module_LayoutComponent.._createChildComponents)
  * [LayoutComponent~_getComponentSchema()](#module_LayoutComponent.._getComponentSchema)
* [Palette](#module_Palette)
* [PaletteComponent](#module_PaletteComponent)
* [Workspace](#module_Workspace)

**Functions**

* [_nodeBelongsToComponent(node)](#_nodeBelongsToComponent)
* [_hasAncestor(id)](#_hasAncestor)
* [_componentHasChildren(component)](#_componentHasChildren)
* [_handleDragStart()](#_handleDragStart)
* [_handleDragOver()](#_handleDragOver)
* [_handleDrop()](#_handleDrop)
 
<a name="module_Layout"></a>
#Layout
A Layout is made up of one or more LayoutComponents.

**Members**

* [Layout](#module_Layout)
  * [Layout~_getComponentById(id, parent)](#module_Layout.._getComponentById)
  * [Layout~_updateComponent(id, binding)](#module_Layout.._updateComponent)
  * [Layout~_removeComponent(id)](#module_Layout.._removeComponent)
  * [Layout~_moveComponent(id, toId)](#module_Layout.._moveComponent)
  * [Layout~_addComponent(parentId, componentType)](#module_Layout.._addComponent)
  * [Layout~_componentIsRoot(id)](#module_Layout.._componentIsRoot)

<a name="module_Layout.._getComponentById"></a>
##Layout~_getComponentById(id, parent)
**Params**

- id `String` - The id of the LayoutComponent you're looking for  
- parent `Object` - The LayoutComponent to check against (if undefined, starts from root)  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._updateComponent"></a>
##Layout~_updateComponent(id, binding)
Update the Layout's state with new LayoutComponent data.

**Params**

- id `String` - The id of the LayoutComponent you want to update.  
- binding `Object` - The new value of the LayoutComponent.  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._removeComponent"></a>
##Layout~_removeComponent(id)
Revomes a LayoutComponent and all of it's children from the Layout.

**Params**

- id `String` - The ID of the LayoutComponent to remove.  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._moveComponent"></a>
##Layout~_moveComponent(id, toId)
Move a LayoutComponent to a new parent.

**Params**

- id `String` - The ID of the LayoutComponent that's getting moved.  
- toId `String` - Parent we're moving the LayoutComponent to.  

**Scope**: inner function of [Layout](#module_Layout)  
<a name="module_Layout.._addComponent"></a>
##Layout~_addComponent(parentId, componentType)
Add a workspce field to the Workspace.

**Params**

- parentId `String` - ID of the LayoutComponent we're adding the new LayoutComponent to.  
- componentType `String` - Type of LayoutComponent we're adding.  

**Scope**: inner function of [Layout](#module_Layout)  
**Returns**: `String` - ID of the new LayoutComponent.  
<a name="module_Layout.._componentIsRoot"></a>
##Layout~_componentIsRoot(id)
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
  * [LayoutComponent~_createChildComponents()](#module_LayoutComponent.._createChildComponents)
  * [LayoutComponent~_getComponentSchema()](#module_LayoutComponent.._getComponentSchema)

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
<a name="module_LayoutComponent.._createChildComponents"></a>
##LayoutComponent~_createChildComponents()
Create the child components for the current WorkspaceField.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Array` - Child layout fields of the current WorkspaceField.  
<a name="module_LayoutComponent.._getComponentSchema"></a>
##LayoutComponent~_getComponentSchema()
Get the schema for the LayoutComponent.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `Array` - The schemas relating to a LayoutComponent.  
<a name="module_Palette"></a>
#Palette
Wrapper component for the available fields.

<a name="module_PaletteComponent"></a>
#PaletteComponent
A PalettleComponent can be dragged onto a Layout, creating a LayoutComponent.

<a name="module_Workspace"></a>
#Workspace
Workspace is the base component of NeoLayout.

<a name="_nodeBelongsToComponent"></a>
#_nodeBelongsToComponent(node)
Check if a DOM node is part of a WorkspaceField.

**Params**

- node `Object` - A DOM node  

**Returns**: `Boolean`  
<a name="_hasAncestor"></a>
#_hasAncestor(id)
Check if the current LayoutComponent has an ancestor matching an ID.

**Params**

- id `String`  

<a name="_componentHasChildren"></a>
#_componentHasChildren(component)
Check if a component has child components.

**Params**

- component `Object`  

**Returns**: `Boolean`  
<a name="_handleDragStart"></a>
#_handleDragStart()
Handle the drag event on components.

<a name="_handleDragOver"></a>
#_handleDragOver()
By default, data/elements cannot be dropped on other elements. To allow a drop, we must prevent the default handling of the element.

<a name="_handleDrop"></a>
#_handleDrop()
Handle the drop event of a component.

