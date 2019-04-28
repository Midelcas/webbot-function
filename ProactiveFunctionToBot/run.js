const azure = require('azure-storage');

const tableService = azure.createTableService();
//const tableName = "DEVICETELEMETRY";
const MAX_ROWS = 20;

module.exports = function (context, myQueueItem) {
    var id;
    var tableName;
    var quantity;
    if(myQueueItem.id){
        id=myQueueItem.id;
    }else{
        id='g5-rpi-simulated';
    }
    if(myQueueItem.quantity){
        quantity=myQueueItem.quantity;
    }else{
        quantity=1;
    }
    if(myQueueItem.tableName){
        tableName=myQueueItem.tableName;
    }else{
        tableName = "DEVICETELEMETRY";
    }
    context.log('JavaScript queue trigger function processed work item:', myQueueItem);
    
    var query = new azure.TableQuery().top(quantity).where('deviceId == ?',id);

    tableService.queryEntities(tableName, query, null, function (error, result, response) {
        if (!error) {
            context.log(response.body.value);
            context.log(response.body.value[0].deviceId);

            var message = {
                'text': response.body.value,
                'address': myQueueItem.address
            };
            context.done(null,message);
        } else {
            context.done(null,'error' );
        }
    });
};