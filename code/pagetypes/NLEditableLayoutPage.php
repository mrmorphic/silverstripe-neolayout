<?php

/**
 * NLEditableLayoutPage is a sample page type that includes an editable layout. The intent is a very basic page where all the content
 * is configured in the NLView, and the page itself is the context for the view.
 */
class NLEditableLayoutPage extends Page
{

    public static $singular_name = "Editable Layout Page";
    public static $db = array(
        "EditableLayout" => "Text"
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab(
            "Root.Layout",
            $layoutEditor = new NLCMSLayoutEditorField("EditableLayout", "Layout", $this)
        );

        $layoutEditor->setViewControllerURL($this->Link("DisplayView"));
        $layoutEditor->setContext($this);

        return $fields;
    }
}

class NLEditableLayoutPage_Controller extends Page_Controller
{
    public static $allowed_actions = array("DisplayView");

    /**
     * Template function to render the view.
     */
    public function DisplayView()
    {
        return new NLView($this, "DisplayView", $this->data()->EditableLayout, $this);
    }
}
