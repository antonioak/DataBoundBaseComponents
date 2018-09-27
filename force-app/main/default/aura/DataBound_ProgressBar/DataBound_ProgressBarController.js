({
    doInit : function(component, event, helper)
    {
        var myFieldName = component.get("v.dbFieldName");
        var fields = new Array(myFieldName);

        component.set("v.dbFieldNames", fields);

        component.find("recordLoader").reloadRecord();
    },

    handleRecordUpdated: function(component, event, helper)
    {
        var eventParams = event.getParams();
        var fieldName = component.get("v.dbFieldName");
        var fieldValue = component.get("v.simpleRecord." + fieldName);
        var cmpValue = component.find("progressBar");

        console.log("PROGRESS BAR:  RECORD UPDATED:  " + fieldName + "--" + eventParams.changeType);

        if(eventParams.changeType === "LOADED")
        {
           // record is loaded (render other component which needs record data value)
            //console.log("Record is loaded successfully.");
            //var cmp = component.find("progressBar");
            //cmp.set("v.value", component.get("v.simpleRecord." + component.get("v.dbFieldName")));

            component.find("progressBar").set("v.value", fieldValue);

        }
        else if(eventParams.changeType === "CHANGED")
        {
            // record is changed
            console.log("Record is changed.");

            var changedFields = eventParams.changedFields;
            console.log("PROGRESS BAR:  Fields that are changed:  " + JSON.stringify(changedFields));

            if (changedFields[fieldName])
            {
                var oldValue = changedFields[fieldName]["oldValue"];
                var newValue = changedFields[fieldName]["value"]

                console.log("PROGRESS BAR [OLD VALUE,NEW VALUE] == " + oldValue + "," + newValue);

                component.set("v.simpleRecord." + fieldName, newValue);
    
                component.find("recordLoader").reloadRecord();
            }

            //component.find("recordLoader").reloadRecord();
        }
        else if(eventParams.changeType === "REMOVED")
        {
            // record is deleted
            console.log("Record is removed.");
        }
        else if(eventParams.changeType === "ERROR")
        {
            // there’s an error while loading, saving, or deleting the record
            console.log("Error loading record.");
        }
    },    
})
