#Index

**Modules**

* [FieldEditor](#module_FieldEditor)
  * [FieldEditor~getCssClasses(requiredClasses)](#module_FieldEditor..getCssClasses)
  * [FieldEditor~toggleModalEditor()](#module_FieldEditor..toggleModalEditor)
  * [FieldEditor~getEditorButtons()](#module_FieldEditor..getEditorButtons)
* [FieldEditorForm](#module_FieldEditorForm)
  * [FieldEditorForm~getFieldSchema(componentType, schemas)](#module_FieldEditorForm..getFieldSchema)
  * [FieldEditorForm~createFormRows(schema, contextMetadata)](#module_FieldEditorForm..createFormRows)
  * [FieldEditorForm~getRows()](#module_FieldEditorForm..getRows)
  * [FieldEditorForm~handleSave()](#module_FieldEditorForm..handleSave)
  * [FieldEditorForm~handleCancel()](#module_FieldEditorForm..handleCancel)
* [FieldEditorFormRow](#module_FieldEditorFormRow)
  * [FieldEditorFormRow~getContextOptions()](#module_FieldEditorFormRow..getContextOptions)
  * [FieldEditorFormRow~handleValueChange(event)](#module_FieldEditorFormRow..handleValueChange)
  * [FieldEditorFormRow~getInputTypes()](#module_FieldEditorFormRow..getInputTypes)
  * [FieldEditorFormRow~handleTypeChange(event)](#module_FieldEditorFormRow..handleTypeChange)
* [Palette](#module_Palette)
* [PaletteField](#module_PaletteField)
  * [PaletteField~_handleDragStart()](#module_PaletteField.._handleDragStart)
* [Workspace](#module_Workspace)
  * [Workspace~_allocateIds(workspaceField)](#module_Workspace.._allocateIds)
  * [Workspace~_getFieldById(id, parent)](#module_Workspace.._getFieldById)
  * [Workspace~_updateFieldData(id, binding)](#module_Workspace.._updateFieldData)
  * [Workspace~_removeFieldFromWorkspace()](#module_Workspace.._removeFieldFromWorkspace)
  * [Workspace~_moveWorkspaceField(fieldId, toId)](#module_Workspace.._moveWorkspaceField)
  * [Workspace~_addWorkspaceField(parentId, fieldType)](#module_Workspace.._addWorkspaceField)
  * [Workspace~_fieldIsRoot(id)](#module_Workspace.._fieldIsRoot)
* [WorkspaceField](#module_WorkspaceField)
  * [WorkspaceField~canEdit()](#module_WorkspaceField..canEdit)
  * [WorkspaceField~canRemove()](#module_WorkspaceField..canRemove)
  * [WorkspaceField~createChildFields()](#module_WorkspaceField..createChildFields)
  * [WorkspaceField~_allowDrop()](#module_WorkspaceField.._allowDrop)
  * [WorkspaceField~_nodeBelongsToField(node)](#module_WorkspaceField.._nodeBelongsToField)
  * [WorkspaceField~_handleDragStart()](#module_WorkspaceField.._handleDragStart)
  * [WorkspaceField~_hasAncestor(id)](#module_WorkspaceField.._hasAncestor)
  * [WorkspaceField~_handleDrop()](#module_WorkspaceField.._handleDrop)
 
<a name="module_FieldEditor"></a>
#FieldEditor
Enables editing of a WorkspaceField.

**Members**

* [FieldEditor](#module_FieldEditor)
  * [FieldEditor~getCssClasses(requiredClasses)](#module_FieldEditor..getCssClasses)
  * [FieldEditor~toggleModalEditor()](#module_FieldEditor..toggleModalEditor)
  * [FieldEditor~getEditorButtons()](#module_FieldEditor..getEditorButtons)

<a name="module_FieldEditor..getCssClasses"></a>
##FieldEditor~getCssClasses(requiredClasses)
If the FieldEditor is not currently in use, the hide class will be added to the element.

**Params**

- requiredClasses `String` - CSS classes that are required for the element.  

**Scope**: inner function of [FieldEditor](#module_FieldEditor)  
**Returns**: `String` - Includes the required class and the 'hide' class if the condition is met.  
<a name="module_FieldEditor..toggleModalEditor"></a>
##FieldEditor~toggleModalEditor()
Toggle the 'editing' state of the editor.

**Scope**: inner function of [FieldEditor](#module_FieldEditor)  
<a name="module_FieldEditor..getEditorButtons"></a>
##FieldEditor~getEditorButtons()
Generate the buttons available in the editor.

**Scope**: inner function of [FieldEditor](#module_FieldEditor)  
**Returns**: `Object`  
<a name="module_FieldEditorForm"></a>
#FieldEditorForm
A sub-component of FieldEditor, responsible for saving and canceling changes.

**Members**

* [FieldEditorForm](#module_FieldEditorForm)
  * [FieldEditorForm~getFieldSchema(componentType, schemas)](#module_FieldEditorForm..getFieldSchema)
  * [FieldEditorForm~createFormRows(schema, contextMetadata)](#module_FieldEditorForm..createFormRows)
  * [FieldEditorForm~getRows()](#module_FieldEditorForm..getRows)
  * [FieldEditorForm~handleSave()](#module_FieldEditorForm..handleSave)
  * [FieldEditorForm~handleCancel()](#module_FieldEditorForm..handleCancel)

<a name="module_FieldEditorForm..getFieldSchema"></a>
##FieldEditorForm~getFieldSchema(componentType, schemas)
Get a list a schemas which apply to a Workspace field.

**Params**

- componentType `String` - The ClassName of a WorkspaceField.  
- schemas `Array` - Schemas defined by metadata.components.  

**Scope**: inner function of [FieldEditorForm](#module_FieldEditorForm)  
**Returns**: `Array` - The schemas relating to a WorkspaceField.  
<a name="module_FieldEditorForm..createFormRows"></a>
##FieldEditorForm~createFormRows(schema, contextMetadata)
Create a FieldEditorRow for each schema relating to the WorkspaceField.

**Params**

- schema `Object`  
- contextMetadata `Object`  

**Scope**: inner function of [FieldEditorForm](#module_FieldEditorForm)  
**Returns**:  - A list of FieldEditorRow's.  
<a name="module_FieldEditorForm..getRows"></a>
##FieldEditorForm~getRows()
Gets the FieldEditorFormRow's belonging to the current FieldEditorForm.

**Scope**: inner function of [FieldEditorForm](#module_FieldEditorForm)  
**Returns**: `Array`  
<a name="module_FieldEditorForm..handleSave"></a>
##FieldEditorForm~handleSave()
Handle saving updates to a WorkspaceField.

**Scope**: inner function of [FieldEditorForm](#module_FieldEditorForm)  
<a name="module_FieldEditorForm..handleCancel"></a>
##FieldEditorForm~handleCancel()
Handle canceling changes made in the editor.

**Scope**: inner function of [FieldEditorForm](#module_FieldEditorForm)  
<a name="module_FieldEditorFormRow"></a>
#FieldEditorFormRow
A sub-component of FieldEditorForm. Each row represents a field binding.

**Members**

* [FieldEditorFormRow](#module_FieldEditorFormRow)
  * [FieldEditorFormRow~getContextOptions()](#module_FieldEditorFormRow..getContextOptions)
  * [FieldEditorFormRow~handleValueChange(event)](#module_FieldEditorFormRow..handleValueChange)
  * [FieldEditorFormRow~getInputTypes()](#module_FieldEditorFormRow..getInputTypes)
  * [FieldEditorFormRow~handleTypeChange(event)](#module_FieldEditorFormRow..handleTypeChange)

<a name="module_FieldEditorFormRow..getContextOptions"></a>
##FieldEditorFormRow~getContextOptions()
Generates a list of options to populate the value dropdown (when state.type === 'context').

**Scope**: inner function of [FieldEditorFormRow](#module_FieldEditorFormRow)  
**Returns**: `Array`  
<a name="module_FieldEditorFormRow..handleValueChange"></a>
##FieldEditorFormRow~handleValueChange(event)
Event handler for changes triggered by the value input.

**Params**

- event `Object`  

**Scope**: inner function of [FieldEditorFormRow](#module_FieldEditorFormRow)  
<a name="module_FieldEditorFormRow..getInputTypes"></a>
##FieldEditorFormRow~getInputTypes()
Generates the input field bound to the state's `value` property.

**Scope**: inner function of [FieldEditorFormRow](#module_FieldEditorFormRow)  
**Returns**: `Object`  
<a name="module_FieldEditorFormRow..handleTypeChange"></a>
##FieldEditorFormRow~handleTypeChange(event)
Event handler for changes triggered by the type dropdown. Switching between context and embedded.

**Params**

- event `Object`  

**Scope**: inner function of [FieldEditorFormRow](#module_FieldEditorFormRow)  
<a name="module_Palette"></a>
#Palette
Wrapper component for the available fields.

<a name="module_PaletteField"></a>
#PaletteField
A field which can be added to the Workspace.

<a name="module_PaletteField.._handleDragStart"></a>
##PaletteField~_handleDragStart()
Handle the drag event on PaletteField's

**Scope**: inner function of [PaletteField](#module_PaletteField)  
<a name="module_Workspace"></a>
#Workspace
Wrapper component for the various layout types.

**Members**

* [Workspace](#module_Workspace)
  * [Workspace~_allocateIds(workspaceField)](#module_Workspace.._allocateIds)
  * [Workspace~_getFieldById(id, parent)](#module_Workspace.._getFieldById)
  * [Workspace~_updateFieldData(id, binding)](#module_Workspace.._updateFieldData)
  * [Workspace~_removeFieldFromWorkspace()](#module_Workspace.._removeFieldFromWorkspace)
  * [Workspace~_moveWorkspaceField(fieldId, toId)](#module_Workspace.._moveWorkspaceField)
  * [Workspace~_addWorkspaceField(parentId, fieldType)](#module_Workspace.._addWorkspaceField)
  * [Workspace~_fieldIsRoot(id)](#module_Workspace.._fieldIsRoot)

<a name="module_Workspace.._allocateIds"></a>
##Workspace~_allocateIds(workspaceField)
Recursivly allocate id's to a WorkspaceField. WorkspaceField's with an existing id are ignored.

**Params**

- workspaceField `Object` - The field you wish to assign an id to.  

**Scope**: inner function of [Workspace](#module_Workspace)  
**Returns**: `Object` - The updated workspaceField.  
<a name="module_Workspace.._getFieldById"></a>
##Workspace~_getFieldById(id, parent)
**Params**

- id `String` - The id of the WorkspaceField you're looking for  
- parent `Object` - The field to check against (if undefined, starts from root)  

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_Workspace.._updateFieldData"></a>
##Workspace~_updateFieldData(id, binding)
Update the Workspace's state. Will recurse down children from the `workspaceField` param.

**Params**

- id `String` - The id of the WorkspaceField you want to update.  
- binding `Object` - The new value of the WorkspaceField.  

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_Workspace.._removeFieldFromWorkspace"></a>
##Workspace~_removeFieldFromWorkspace()
Revomes a WorkspaceField and all of it's children from the Workspace.

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_Workspace.._moveWorkspaceField"></a>
##Workspace~_moveWorkspaceField(fieldId, toId)
Move a workspace field to a new parent.

**Params**

- fieldId `String` - Field that's getting moved  
- toId `String` - Parent we're moving the field to  

**Scope**: inner function of [Workspace](#module_Workspace)  
<a name="module_Workspace.._addWorkspaceField"></a>
##Workspace~_addWorkspaceField(parentId, fieldType)
Add a workspce field to the Workspace.

**Params**

- parentId `String` - ID of the WorkspaceField we're adding the new component to.  
- fieldType `String` - Type of field we're adding.  

**Scope**: inner function of [Workspace](#module_Workspace)  
**Returns**: `String` - ID of the new WorkspaceField.  
<a name="module_Workspace.._fieldIsRoot"></a>
##Workspace~_fieldIsRoot(id)
Determine if a WorkspaceField is the root component.

**Params**

- id `String` - The id of the field we're checking.  

**Scope**: inner function of [Workspace](#module_Workspace)  
**Returns**: `Boolean`  
<a name="module_WorkspaceField"></a>
#WorkspaceField
The core component used to create layouts.

**Members**

* [WorkspaceField](#module_WorkspaceField)
  * [WorkspaceField~canEdit()](#module_WorkspaceField..canEdit)
  * [WorkspaceField~canRemove()](#module_WorkspaceField..canRemove)
  * [WorkspaceField~createChildFields()](#module_WorkspaceField..createChildFields)
  * [WorkspaceField~_allowDrop()](#module_WorkspaceField.._allowDrop)
  * [WorkspaceField~_nodeBelongsToField(node)](#module_WorkspaceField.._nodeBelongsToField)
  * [WorkspaceField~_handleDragStart()](#module_WorkspaceField.._handleDragStart)
  * [WorkspaceField~_hasAncestor(id)](#module_WorkspaceField.._hasAncestor)
  * [WorkspaceField~_handleDrop()](#module_WorkspaceField.._handleDrop)

<a name="module_WorkspaceField..canEdit"></a>
##WorkspaceField~canEdit()
Returns true if the user is able to edit the field.

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
**Returns**: `Boolean`  
<a name="module_WorkspaceField..canRemove"></a>
##WorkspaceField~canRemove()
Returns true if the user is able to remove the field from the workspace.

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
**Returns**: `Boolean`  
<a name="module_WorkspaceField..createChildFields"></a>
##WorkspaceField~createChildFields()
Create the child components for the current WorkspaceField.

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
**Returns**: `Array` - Child layout fields of the current WorkspaceField.  
<a name="module_WorkspaceField.._allowDrop"></a>
##WorkspaceField~_allowDrop()
By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
<a name="module_WorkspaceField.._nodeBelongsToField"></a>
##WorkspaceField~_nodeBelongsToField(node)
Check if a DOM node is part of a WorkspaceField.

**Params**

- node `Object` - A DOM node  

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
**Returns**: `Boolean`  
<a name="module_WorkspaceField.._handleDragStart"></a>
##WorkspaceField~_handleDragStart()
Handle the drag event on WorkspaceField's

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
<a name="module_WorkspaceField.._hasAncestor"></a>
##WorkspaceField~_hasAncestor(id)
Check if the current WorkspaceField has an ancestor matching a WorkspaceField ID.

**Params**

- id `String`  

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
<a name="module_WorkspaceField.._handleDrop"></a>
##WorkspaceField~_handleDrop()
Handle the drop event on a WorkspaceField. Handles dropping of PaletteField's and other WorkspaceField's.

**Scope**: inner function of [WorkspaceField](#module_WorkspaceField)  
