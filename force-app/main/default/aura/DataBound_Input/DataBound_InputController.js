({
    doInit : function(component, event, helper)
    {
        var myFieldName = component.get("v.dbFieldName");
        var fields = new Array(myFieldName);

        component.set("v.dbFieldNames", fields);

        component.find("recordLoader").reloadRecord();
        component.find("inputField").set("v.value", component.get("v.simpleRecord." + myFieldName));

    },

    handleDBEditModeEvent: function(component, event, helper)
    {
        var cmp = component.find("inputField");
        cmp.set("v.readonly", false);
    },

    handleTextChange : function(component, event, helper)
    {
        //  throw an event that tells a Save Component to update it's record value for the bound field.
        var myValue = component.find("inputField").get("v.value");

        //console.log("TEXT BOX CHANGE:  " + component.get("v.dbFieldName") + ":: " + myValue);

        var cmpEvent = $A.get("e.c:dbComponentDirtyEvent");

        cmpEvent.setParam("dbFieldName", component.get("v.dbFieldName"));
        cmpEvent.setParam("dbFieldValue", myValue);

        cmpEvent.fire();
    },

    handleBlur : function(component, event, helper)
    {
        //  throw an event that tells a Save Component to update it's record value for the bound field.
        var myValue = component.find("inputField").get("v.value");
        var simpleValue = component.get("v.simpleRecord." + component.get("v.dbFieldName"));

        if (myValue != simpleValue)
        {
            console.log("TEXT BOX BLUR CHANGE:  " + component.get("v.dbFieldName") + " (" + simpleValue + "," + myValue + ")");

            var cmpEvent = $A.get("e.c:dbComponentDirtyEvent");

            cmpEvent.setParam("dbFieldName", component.get("v.dbFieldName"));
            cmpEvent.setParam("dbFieldValue", myValue);

            cmpEvent.fire();
        }
        else
        {
            console.log("TEXT BOX BLUR NO CHANGE.");
        }
    },

    handleDBCancelEditEvent: function(component, event, helper)
    {
        component.find("recordLoader").reloadRecord();
    },

    handleRecordUpdated: function(component, event, helper)
    {
        var eventParams = event.getParams();
        var fieldName = component.get("v.dbFieldName");
        var fieldValue = component.get("v.simpleRecord." + fieldName);
        var cmpValue = component.find("inputField").get("v.value");

        console.log("INPUT:  RECORD UPDATED:  " + fieldName + "--" + eventParams.changeType);
        //console.log("     FIELD NAME:  " + fieldName);
        //console.log("     RECORD VALUE:  " + component.get("v.record.fields." + fieldName + ".value"));
        //console.log("     SIMPLE VALUE:  " + fieldValue);
        //console.log("     COMPONENT VALUE:  " + cmpValue);    

        if (eventParams.changeType === "LOADED")
        {
           // record is loaded (render other component which needs record data value)
            //console.log("FIELD VALUE:  " + component.get("v.simpleRecord." + component.get("v.dbFieldName")));
            //var cmp = component.find("inputField");
            //cmp.set("v.value", component.get("v.simpleRecord." + component.get("v.dbFieldName")));

            component.find("inputField").set("v.value", fieldValue);

            //console.log("     RECORD VALUE:  " + component.get("v.record.fields." + fieldName + ".value"));
            //console.log("     SIMPLE VALUE:  " + fieldValue);
            //console.log("     COMPONENT VALUE:  " + component.find("inputField").get("v.value"));    
        } 
        else if(eventParams.changeType === "CHANGED") 
        {
            // record is changed

            var changedFields = eventParams.changedFields;
            console.log("INPUT:  Fields that are changed:  " + JSON.stringify(changedFields));

            if (changedFields[fieldName])
            {
                var oldValue = changedFields[fieldName]["oldValue"];
                var newValue = changedFields[fieldName]["value"]

                console.log("INPUT [OLD VALUE,NEW VALUE] == " + oldValue + "," + newValue);

                component.set("v.simpleRecord." + fieldName, newValue);
    
                component.find("recordLoader").reloadRecord();
            }

            //component.find("recordLoader").reloadRecord();

            //console.log("     RECORD VALUE:  " + component.get("v.record.fields." + fieldName + ".value"));
            //console.log("     SIMPLE VALUE:  " + component.get("v.simpleRecord." + fieldName));
            //console.log("     COMPONENT VALUE:  " + component.find("inputField").get("v.value"));    
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
