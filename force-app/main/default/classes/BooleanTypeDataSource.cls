global class BooleanTypeDataSource extends VisualEditor.DynamicPickList
{
    VisualEditor.DesignTimePageContext context;

    global BooleanTypeDataSource(VisualEditor.DesignTimePageContext context)
    {
        this.context = context;
    }

    global override VisualEditor.DataRow getDefaultValue()
    {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('', '');
        return defaultValue;
    }

    global override VisualEditor.DynamicPickListRows getValues()
    {
        VisualEditor.DynamicPickListRows myValues = new VisualEditor.DynamicPickListRows();
        SObjectType objType = Schema.getGlobalDescribe().get(context.entityName);

        Map<String,Schema.SObjectField> fields = objType.getDescribe().fields.getMap();

        //Map<String, Schema.SObjectField> fields = Schema.getGlobalDescribe().get(sobjectname).getDescribe().SObjectType.getDescribe().fields.getMap();
        System.System.debug('getting field names.');
        for (Schema.SObjectField field : fields.values())
        {
            if (Schema.DisplayType.Boolean == field.getDescribe().getType())
            {
                String fieldName = field.getDescribe().getName();
                VisualEditor.DataRow myRow = new VisualEditor.DataRow(fieldName, fieldName);
                myValues.addRow(myRow);
            }
        }

        return myValues;
    }
}
