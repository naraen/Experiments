function list_sender_count() {
  set_header();
  var starting_point=get_requested_starting_point();
  var batch_size=get_requested_batch_size();
  var ending_point=get_requested_ending_point();

  console.log("Starting point=" + starting_point);
  console.log("Batch Size=" + batch_size);
  console.log("Ending point=" + ending_point);

  var processed_count=starting_point;
  for(idx=starting_point; idx<ending_point; idx=idx + batch_size) {
    console.log(idx);
    var inbox_threads = GmailApp.getInboxThreads(idx, batch_size);

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
      sender_array.push([startSeq + i, threadId, messageId, messageDate, messageSender, messageSubject, attachmentsTotalSize]);      
    }
  }

  return sender_array;
}

function set_header(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('sheet1');
  sheet.getRange(1, 1,1, 7).setValues([['#','ThreadId','MessageId', 'Date', 'Sender', 'Subject', 'AttachmentSize']]);
}

function save_sender_list(sender_list){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('sheet1');
  sheet.getRange(sheet.getLastRow()+1, 1, sender_list.length, 7).setValues(sender_list);
  SpreadsheetApp.flush();
}

function save_starting_point(currentStartingPoint){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('TrackingSheet');
  sheet.getRange(1, 2, 1,1).setValue(currentStartingPoint);
  SpreadsheetApp.flush();
}

function get_requested_starting_point(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('TrackingSheet');
  var x = sheet.getRange(1, 2, 1,1).getValue();
  return x;
}

function get_requested_batch_size(){ 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('TrackingSheet');
  var x = sheet.getRange(2, 2, 1,1).getValue();
  return x;
}

function get_requested_ending_point(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('TrackingSheet');
  var x = sheet.getRange(3, 2, 1,1).getValue();
  return x;
}
