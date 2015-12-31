<?php

/**
 * Base class for layout components.
 */
abstract class NLLayoutComponent extends NLComponent
{

    public function maxChildren()
    {
        return "*";
    }

    public function containerClasses($context)
    {
        $a = parent::containerClasses($context);
        $a[] = "layout-container";
        return $a;
    }
}
