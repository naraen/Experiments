function list_sender_count() {
  set_header();
  var batch_definition = get_batch_definition();
  console.log(`Batch definition ${batch_definition}`);

  var [batch_id, starting_point, batch_size, ending_point, search_criteria]= batch_definition;
  console.log(JSON.stringify({batch_id, starting_point, batch_size, ending_point, search_criteria}));

  var processed_count=starting_point;
  for(idx=starting_point; idx<ending_point; idx=idx + batch_size) {
    console.log(idx);
    //var inbox_threads = GmailApp.getInboxThreads(idx, batch_size);
    var inbox_threads=GmailApp.search(search_criteria, idx, batch_size);

    var senders = get_senders_from_messages_in_thread(idx, inbox_threads);
    save_sender_list(senders);
    var result_count = inbox_threads.length;
    processed_count+=result_count;
    save_starting_point(processed_count);

    if (result_count<batch_size) {
      break;
    }
  }
  console.log("total processed count=" + processed_count);
  return;
}

function get_senders_from_messages_in_thread(startSeq, threads){
  var sender_array = [];

  for (var i = 0; i < threads.length; i++) {
    var threadId=threads[i].getId();
    var message = threads[i].getMessages();
    var permalink=threads[i].getPermalink();
    
    for (var x = 0; x < message.length; x++) {
      var messageSender = message[x].getFrom();
      var messageId=message[x].getId()
      var messageDate=message[x].getDate();
      var messageAttachments=message[x].getAttachments();
      var messageSubject=message[x].getSubject();
      var attachmentsTotalSize=0;
      messageAttachments.forEach((attachment)=> {
        attachmentsTotalSize+=attachment.getSize()/1000/1000;
      });
      sender_array.push([startSeq + i, threadId, messageId, messageDate, messageSender, messageSubject, attachmentsTotalSize, permalink]);      
    }
  }

  return sender_array;
}

function set_header(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('sheet1');
  sheet.getRange(1, 1,1, 8).setValues([['#','ThreadId','MessageId', 'Date', 'Sender', 'Subject', 'AttachmentSize(in MB)', 'Link']]);
}

function save_sender_list(sender_list){
  if (sender_list.length==0) {
    return;
  }
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('sheet1');
  sheet.getRange(sheet.getLastRow()+1, 1, sender_list.length, 8).setValues(sender_list);
  SpreadsheetApp.flush();
}

function save_starting_point(currentStartingPoint){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('TrackingSheet');
  sheet.getRange(2, 2, 1,1).setValue(currentStartingPoint);
  SpreadsheetApp.flush();
}

function get_batch_definition(){ 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('TrackingSheet');
  return sheet.getRange(2, 1, 1,5).getValues()[0];
}

