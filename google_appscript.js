function doPost(e) {
  console.log('Received POST request:', e);
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  // Test write a row to verify spreadsheet access
  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key')); 
    const sheet = doc.getSheetByName(sheetName);
    // Write test row to verify sheet access
    sheet.appendRow(['Test Name', 'test@email.com']);
    Logger.log('Successfully wrote test row');
    // let data;
    // if (e.postData && e.postData.contents) {
    //   data = JSON.parse(e.postData.contents);
    // } else {
    //   throw new Error('No data received');
    // }

    // sheet.appendRow([data.name, data.email]);
    // Logger.log('Successfully wrote row with name and email');

    // return ContentService
    //   .createTextOutput(JSON.stringify({ 'result': 'success', 'row': data }))
    //   .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    lock.releaseLock();
  }
}