#Index

**Modules**

* [ComponentActions](#module_ComponentActions)
  * [ComponentActions~create(data)](#module_ComponentActions..create)
  * [ComponentActions~destroy(id)](#module_ComponentActions..destroy)
  * [ComponentActions~update(id, key, value)](#module_ComponentActions..update)
* [Layout](#module_Layout)
  * [Layout~_createRootComponent()](#module_Layout.._createRootComponent)
* [LayoutComponent](#module_LayoutComponent)
  * [LayoutComponent~_createChildComponents()](#module_LayoutComponent.._createChildComponents)
* [Palette](#module_Palette)
* [PaletteComponent](#module_PaletteComponent)
* [Workspace](#module_Workspace)
  * [Workspace~_onChange()](#module_Workspace.._onChange)
  * [Workspace~_populateStore()](#module_Workspace.._populateStore)
  * [Workspace~_transformComponentsForSave(component)](#module_Workspace.._transformComponentsForSave)
  * [Workspace~save()](#module_Workspace..save)
* [ComponentStore](#module_ComponentStore)
  * [ComponentStore~create(data)](#module_ComponentStore..create)
  * [ComponentStore~destroy(id)](#module_ComponentStore..destroy)
  * [ComponentStore~update(id, key, value)](#module_ComponentStore..update)
  * [ComponentStore~getAll()](#module_ComponentStore..getAll)
  * [ComponentStore~getRootComponent()](#module_ComponentStore..getRootComponent)
  * [ComponentStore~getById(id)](#module_ComponentStore..getById)
  * [ComponentStore~getChildren(id)](#module_ComponentStore..getChildren)
  * [ComponentStore~hasAncestor(componentId, ancestorId)](#module_ComponentStore..hasAncestor)
  * [ComponentStore~_isRoot(id)](#module_ComponentStore.._isRoot)
  * [ComponentStore~canEdit(id)](#module_ComponentStore..canEdit)
  * [ComponentStore~canRemove(id)](#module_ComponentStore..canRemove)
  * [ComponentStore~addChangeListener(callback)](#module_ComponentStore..addChangeListener)
  * [ComponentStore~removeChangeListener(callback)](#module_ComponentStore..removeChangeListener)

**Functions**

* [validDrop(targetId, componentId)](#validDrop)
* [_handleDragStart()](#_handleDragStart)
* [_handleDragOver()](#_handleDragOver)
* [_handleDrop()](#_handleDrop)
 
<a name="module_ComponentActions"></a>
#ComponentActions
Actions for components

**Members**

* [ComponentActions](#module_ComponentActions)
  * [ComponentActions~create(data)](#module_ComponentActions..create)
  * [ComponentActions~destroy(id)](#module_ComponentActions..destroy)
  * [ComponentActions~update(id, key, value)](#module_ComponentActions..update)

<a name="module_ComponentActions..create"></a>
##ComponentActions~create(data)
**Params**

- data `object`  
  - \[id\] `string`  
  - \[parent\] `string` - The ID of the parent component.  
  - ClassName `string`  
  - \[bindings\] `object`  
  - \[children\] `array`  

**Scope**: inner function of [ComponentActions](#module_ComponentActions)  
<a name="module_ComponentActions..destroy"></a>
##ComponentActions~destroy(id)
**Params**

- id `string`  

**Scope**: inner function of [ComponentActions](#module_ComponentActions)  
<a name="module_ComponentActions..update"></a>
##ComponentActions~update(id, key, value)
**Params**

- id `string` - The component to update.  
- key `string` - The property to update.  
- value `string` | `number` | `object` | `array` | `null` - The new value.  

**Scope**: inner function of [ComponentActions](#module_ComponentActions)  
<a name="module_Layout"></a>
#Layout
A Layout is made up of one or more LayoutComponents.

<a name="module_Layout.._createRootComponent"></a>
##Layout~_createRootComponent()
**Scope**: inner function of [Layout](#module_Layout)  
**Returns**: `object`  
<a name="module_LayoutComponent"></a>
#LayoutComponent
The core component used to create layouts.

<a name="module_LayoutComponent.._createChildComponents"></a>
##LayoutComponent~_createChildComponents()
Create the child components for the current WorkspaceField.

**Scope**: inner function of [LayoutComponent](#module_LayoutComponent)  
**Returns**: `array` - Child layout fields of the current WorkspaceField.  
<a name="module_Palette"></a>
#Palette
Wrapper component for the available fields.

<a name="module_PaletteComponent"></a>
#PaletteComponent
A PalettleComponent can be dragged onto a Layout, creating a LayoutComponent.

<a name="module_Workspace"></a>
#Workspace
Workspace is the base component of NeoLayout.

**Members**

* [Workspace](#module_Workspace)
  * [Workspace~_onChange()](#module_Workspace.._onChange)
  * [Workspace~_populateStore()](#module_Workspace.._populateStore)
  * [Workspace~_transformComponentsForSave(component)](#module_Workspace.._transformComponentsForSave)
  * [Workspace~save()](#module_Workspace..save)

<a name="module_Workspace.._onChange"></a>
##Workspace~_onChange()
Called when the ComponentStore is modified.

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_Workspace.._populateStore"></a>
##Workspace~_populateStore()
Populates the ComponentStore with data from the database.

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_Workspace.._transformComponentsForSave"></a>
##Workspace~_transformComponentsForSave(component)
The Workspace's state needs to be formatted into a component hierarchy
and transformed to JSON so it can be saved to the database.

**Params**

- component `object` - The root component to transform.  

**Scope**: inner function of [Workspace](#module_Workspace)  
**Returns**: `string` - - JSON representation of the Workspace's state.  
<a name="module_Workspace..save"></a>
##Workspace~save()
Writes changes to the DOM so that changes are persisted to the database
when the page is saved.

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_ComponentStore"></a>
#ComponentStore
The store for components within the application.

**Members**

* [ComponentStore](#module_ComponentStore)
  * [ComponentStore~create(data)](#module_ComponentStore..create)
  * [ComponentStore~destroy(id)](#module_ComponentStore..destroy)
  * [ComponentStore~update(id, key, value)](#module_ComponentStore..update)
  * [ComponentStore~getAll()](#module_ComponentStore..getAll)
  * [ComponentStore~getRootComponent()](#module_ComponentStore..getRootComponent)
  * [ComponentStore~getById(id)](#module_ComponentStore..getById)
  * [ComponentStore~getChildren(id)](#module_ComponentStore..getChildren)
  * [ComponentStore~hasAncestor(componentId, ancestorId)](#module_ComponentStore..hasAncestor)
  * [ComponentStore~_isRoot(id)](#module_ComponentStore.._isRoot)
  * [ComponentStore~canEdit(id)](#module_ComponentStore..canEdit)
  * [ComponentStore~canRemove(id)](#module_ComponentStore..canRemove)
  * [ComponentStore~addChangeListener(callback)](#module_ComponentStore..addChangeListener)
  * [ComponentStore~removeChangeListener(callback)](#module_ComponentStore..removeChangeListener)

<a name="module_ComponentStore..create"></a>
##ComponentStore~create(data)
Add a component and its children to the store.

**Params**

- data `object` - The data to populate the component with.  
  - \[id\] `string` - ID of the component. If undefined an ID will be generated.  
  - parent `string` - ID of the LayoutComponent we're adding the new LayoutComponent to.  
  - ClassName `string` - Type of LayoutComponent we're adding.  
  - bindings `object`  
  - \[children\] `array` - Child components.  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
<a name="module_ComponentStore..destroy"></a>
##ComponentStore~destroy(id)
Revomes a LayoutComponent and all of it's children from the Layout.

**Params**

- id `string` - The ID of the LayoutComponent to remove.  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
<a name="module_ComponentStore..update"></a>
##ComponentStore~update(id, key, value)
Update a component's property

**Params**

- id `string` - The id of the LayoutComponent you want to update.  
- key `string` - The key to update  
- value `*` - The new value.  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
<a name="module_ComponentStore..getAll"></a>
##ComponentStore~getAll()
Get the entire collection of Components.

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `object`  
<a name="module_ComponentStore..getRootComponent"></a>
##ComponentStore~getRootComponent()
**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `object` | `null`  
<a name="module_ComponentStore..getById"></a>
##ComponentStore~getById(id)
**Params**

- id `string`  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `object`  
<a name="module_ComponentStore..getChildren"></a>
##ComponentStore~getChildren(id)
Get children of a component

**Params**

- id `string` - The id of the parent  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `array`  
<a name="module_ComponentStore..hasAncestor"></a>
##ComponentStore~hasAncestor(componentId, ancestorId)
**Params**

- componentId `string`  
- ancestorId `string`  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
<a name="module_ComponentStore.._isRoot"></a>
##ComponentStore~_isRoot(id)
Determine if a LayoutComponent is the root component.

**Params**

- id `string` - The id of the LayoutComponent we're checking.  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `boolean`  
<a name="module_ComponentStore..canEdit"></a>
##ComponentStore~canEdit(id)
Returns true if the user is able to edit the field.

**Params**

- id `string`  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `boolean`  
<a name="module_ComponentStore..canRemove"></a>
##ComponentStore~canRemove(id)
Returns true if the user is able to remove the LayoutComponent from the Layout.

**Params**

- id `string`  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
**Returns**: `boolean`  
<a name="module_ComponentStore..addChangeListener"></a>
##ComponentStore~addChangeListener(callback)
**Params**

- callback `function`  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
<a name="module_ComponentStore..removeChangeListener"></a>
##ComponentStore~removeChangeListener(callback)
**Params**

- callback `function`  

**Scope**: inner function of [ComponentStore](#module_ComponentStore)  
<a name="validDrop"></a>
#validDrop(targetId, componentId)
Make sure the drop target is valid.

**Params**

- targetId `string` - ID of the drop target.  
- componentId `string` - ID of the component being dropped.  

**Returns**: `boolean`  
<a name="_handleDragStart"></a>
#_handleDragStart()
Handle the drag event on components.

<a name="_handleDragOver"></a>
#_handleDragOver()
Drag and drop behaviour is opt-in. To enable a drop, we must prevent the default handling of the element.

<a name="_handleDrop"></a>
#_handleDrop()
Handle the drop event of a component.

