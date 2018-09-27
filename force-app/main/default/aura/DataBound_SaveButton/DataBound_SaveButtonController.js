({
    doInit : function(component, event, helper)
    {
        //  throw an event that says a Save Button is present.
        //  this way DB Components know they can work in Edit Mode (vs R/O Mode).

        console.log("FIRING DB EDIT MODE EVENT.....");
        
        var cmpEvent = $A.get("e.c:dbEditModeEvent");

        cmpEvent.fire();
    },

    onCancelClick : function(component, event, helper)
    {
        component.find("recordLoader").reloadRecord();

        //
        //  Notify all DataBound Components to cancel out of this change and revert to origial record values.
        //
        var cmpEvent = $A.get("e.c:dbCancelEditEvent");
        cmpEvent.fire();

        //
        //  Notify other Save Components to disable themselves.
        //
        var cmpEvent = $A.get("e.c:dbComponentDirtyEvent");

        cmpEvent.setParam("dbFieldName", "DISABLE");
        cmpEvent.setParam("dbFieldValue", "DISABLE");

        cmpEvent.fire();
    },

    onSaveClick : function(component, event, helper)
    {
        var recordLoader = component.find("recordLoader");

        recordLoader.saveRecord($A.getCallback(function(saveResult) {
            // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful 
            // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT")
            {
                // handle component related logic in event handler
                console.log("SAVE RESULT:  " + saveResult.state);
                recordLoader.reloadRecord();

                //
                //  Notify other Save Components to disable themselves.
                //
                var cmpEvent = $A.get("e.c:dbComponentDirtyEvent");

                cmpEvent.setParam("dbFieldName", "DISABLE");
                cmpEvent.setParam("dbFieldValue", "DISABLE");

                cmpEvent.fire();

            }
            else if (saveResult.state === "INCOMPLETE")
            {
                console.log("User is offline, device doesn't support drafts.");
            }
            else if (saveResult.state === "ERROR")
            {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));

                var errorToast = $A.get("e.force:showToast");
                errorToast.setParams({
                    "title": "Error Saving Record.",
                    "message": saveResult.error[0].message,
                });
                errorToast.fire();
            }
            else
            {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));
    },

    handleDBComponentDirtyEvent: function(component, event, helper)
    {
        //console.log("DB SAVE BUTTON:  HANDLING COMPONENT DIRTY EVENT.....");
        var fieldName = event.getParam("dbFieldName");
        var fieldValue = event.getParam("dbFieldValue");

        console.log("SAVE BUTTON DIRTY EVENT:  " + fieldName + ", " + fieldValue);

        component.set("v.simpleRecord." + fieldName, fieldValue);

        //console.log("SIMPLE RECORD VALUE:  " + component.get("v.simpleRecord." + component.get("v.dbFieldName")));

        var cmp = component.find("saveButton");
        cmp.set("v.disabled", fieldName=="DISABLE");

        var cmp = component.find("cancelButton");
        cmp.set("v.disabled", fieldName=="DISABLE");
    }, 
    
    handleRecordUpdated: function(component, event, helper)
    {
        var eventParams = event.getParams();

        if (eventParams.changeType === "LOADED")
        {
           // record is loaded (render other component which needs record data value)
            console.log("BUTTON:  Record is loaded successfully.");
        } 
        else if(eventParams.changeType === "CHANGED") 
        {
            // record is changed
            console.log("BUTTON:  Record is changed.");

            var changedFields = eventParams.changedFields;
            console.log("BUTTON:  Fields that are changed:  " + JSON.stringify(changedFields));

            component.find("recordLoader").reloadRecord();
        }
        else if(eventParams.changeType === "REMOVED")
        {
            // record is deleted
            console.log("BUTTON:  Record is removed.");
        }
        else if(eventParams.changeType === "ERROR")
        {
            // there’s an error while loading, saving, or deleting the record
            console.log("BUTTON:  Error loading record.");
        }
    },
    
})