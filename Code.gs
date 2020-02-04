function gameTick() {
  var startPage = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start");
    
  var startStats = startPage.getRange("D1:D11").getValues();
    
  if(startStats[0][0] == 'RUNNING') {
    startPage.getRange('d9').setValue('=now()');
    var shipSections = getShipSections();
  
    /*
    var scriptProperties = PropertiesService.getScriptProperties();
    var bridgeState = JSON.parse(scriptProperties.getProperty("Bridge"));
    var engineeringState = JSON.parse(scriptProperties.getProperty("Engineering"));
    */
    
    if(startStats[6][0] > 100*startStats[7][0]) {
      //Too many bugs, time to end the game
      startPage.getRange('d1').setValue("STOPPED");
      for each(var shipSection in shipSections) {
        shipSection.getRange("B1").setValue("💀💀💀💀💀");
        shipSection.getRange("B2").setValue("GAME OVER! You scored " + startStats[10][0]);
        shipSection.getRange('D1:I1').setValue("");
      }
    }
    else {
      increaseDifficulty(startStats[9][0]);
      var test = startStats[9][0];
      var difficulty = Math.floor(startStats[9][0]);
      
      var currentBugs = startStats[6][0];
      
      for each(var shipSection in shipSections) {
        infectBugs(shipSection);
        
        for(var i = 0; i < difficulty; i++) {
          randomBug(shipSection);
        }
      }
      assignSection();
      populateConsole();
    }
  }
} 

function getShipSections(){
  var shipSectionNames = [];
  var shipSections = [];
  var startPage = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start");
  
  if(!startPage.getRange('b2').isBlank()){
    shipSectionNames.push("Ops");
  }
  if(!startPage.getRange('b3').isBlank()){
    shipSectionNames.push("Engineering");
  }
  if(!startPage.getRange('b4').isBlank()){
    shipSectionNames.push("Science");
  }
  if(!startPage.getRange('b5').isBlank()){
    shipSectionNames.push("Tactical");
  }
  if(!startPage.getRange('b6').isBlank()){
    shipSectionNames.push("Medical");
  }
  
  for each(var shipSectionName in shipSectionNames){
    shipSections.push(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(shipSectionName));    
  }
  return shipSections;
}

function increaseDifficulty(difficulty){
  var start = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start");
  var score = start.getRange('B2:D7').getValues();
  var increasedDifficulty = false;
  if (score[0][0] != "" && score[0][2] == 0) {
    start.getRange('C2').setValue(score[0][1] + 1);
    if(!increasedDifficulty){
      start.getRange('b10').setValue(difficulty + 1);
      increasedDifficulty = true;
    }
  }
  if (score[1][0] != "" && score[1][2] == 0) {
    start.getRange('C3').setValue(score[1][1] + 1);
    if(!increasedDifficulty){
      start.getRange('b10').setValue(difficulty + 1);
      increasedDifficulty = true;
    }
  }
  if (score[2][0] != "" && score[2][2] == 0) {
    start.getRange('C4').setValue(score[2][1] + 1);
    if(!increasedDifficulty){
      start.getRange('b10').setValue(difficulty + 1);
      increasedDifficulty = true;
    }
  }
  if (score[3][0] != "" && score[3][2] == 0) {
    start.getRange('C5').setValue(score[3][1] + 1);
    if(!increasedDifficulty){
      start.getRange('b10').setValue(difficulty + 1);
      increasedDifficulty = true;
    }
  }
  if (score[4][0] != "" && score[4][2] == 0) {
    start.getRange('C6').setValue(score[4][1] + 1);
    if(!increasedDifficulty){
      start.getRange('b10').setValue(difficulty + 1);
      increasedDifficulty = true;
    }
  }
}

function assignSection(){
  var shipSections = getShipSections();
  var shipAssignments = getShipSections();
  
  shuffleArray(shipAssignments);
  for(var i = 0; i < shipSections.length; i++) {
    shipSections[i].getRange('BA1').setValue(shipAssignments[i].getName());
  } 
}

function populateConsole(){
  var shipSections = getShipSections();
  
  for each(var shipSection in shipSections){
    var console = shipSection.getRange('b2');
    var assignment = shipSection.getRange('BA1').getValue();
    var foundBugs = findBugs(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(assignment));
    if (foundBugs.length == 0) {
      console.setValue("No bugs found in " + assignment + "! Go get a cookie!");
    }
    else {
      console.setValue(assignment + " Bugs: " + foundBugs);
    }
  }
  /*
  for(var i = 0; i < shipSections.length; i++) {
    shipSections[i].getRange('b2').setValue(shipAssignments[i].getName() + " Bugs: " + findBugs(shipAssignments[i]));
  }
  */
  
  //SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet).getRange('b2').setValue(message)
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomBug(sheet){
/*  var range = ss.getRange(1,1,ss.getLastRow(), 4); //the range you need: 4 columns on all row which are available
  var data = range.getValues();

  for(var i = 0; i < data.length; i++) 
  { 
    var j = Math.floor(Math.random()*(data[i].length)); //method of randomization
    var element = data[i][j]; // The element which is randomizely choose
    ss.getRange(i+1, 6).setValue(element); 
  }
  
  */
  //return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet).getRange('randbetween(a3,z100)')
  var randomBug = sheet.getRange(randbetween(3,50,3,50),randbetween(3,50,3,50));
  randomBug.setValue('🐛');
  randomBug.setBackground('red');
  return randomBug;
  //return .setValue('🐛');
  //return '=randbetween(a3,z100)';
}

function findBugs(sheet) {
  var bugs = [];
  var grid = sheet.getRange("C3:AW49").getValues();
  for(var i = 0; i < 47; i++) {
    for(var j = 0; j <47; j++) {
      if(grid[i][j] == '🐛') {
        bugs.push(sheet.getRange(i+3, j+3).getA1Notation());
      }
      if(bugs.length > 20) {
        break;
      }
    }
    if(bugs.length > 20) {
      break;
    }
  }
  Logger.log(bugs);
  return bugs;
}

function infectBugs(sheet) {
  var grid = sheet.getRange("C3:AW49").getValues();
  var count = 0;
  for(var i = 0; i < 47; i++) {
    for(var j = 0; j <47; j++) {
      if(grid[i][j] == '🐛') {
        var randomBug = sheet.getRange(randbetween(i+2,i+4,3,50),randbetween(j+2,j+4,3,50));
        randomBug.setValue('🐛');
        randomBug.setBackground('red');
        count++;
      }
      if(count > 20) {
        break;
      }
    }
    if(count > 20) {
      break;
    }
  }
}

function randbetween(i, j, min, max) {
  var randNum = Math.floor(Math.random()*(j-i))+i;
  if(randNum == 56347) {
    randNum++;
  }
  else if(randNum < min){
    randNum = min;
  }
  else if(randNum > max){
    randNum = max;
  }
  return randNum;
}

function onEdit(e) {
  var startStats = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start").getRange("D1:D10").getValues();
  
  Logger.log(e.range.getSheet().getName());
  
  if (e.range.getSheet().getName() != 'Start'&& startStats[0][0] == 'RUNNING') {
    var editedRange = e.range;
    //Logger.log(editedRange.getBackground());
    
    var editedValues = editedRange.getValues();
    var editedBG = editedRange.getBackgrounds();
    
    var editedStartColumn = editedRange.getColumn();
    var editedStartRow = editedRange.getRow();
    var editedSheet = editedRange.getSheet();
       
    for(var i = 0; i < editedRange.getNumColumns() - 1; i++) {
      for(var j = 0; j < editedRange.getNumColumns() - 1; j++) {
        if(editedValues[i][j] == "") {
          var editedCell = editedSheet.getRange(editedStartColumn + i, editedStartRow + j);
          if(editedBG[i][j] == '#ff0000'){
            Logger.log("BUG SQUASHED!");
            editedCell.setValue(randomEmoji());
            editedCell.setBackground(randomColor());
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start").getRange('b10').setValue(startStats[9][0] + 0.1);
          }
          else {
            Logger.log("EMOJI SQUASHED!");
            editedCell.setValue(randomEmoji());
            randomBug(editedCell.getSheet());
            randomBug(editedCell.getSheet());
            //refreshScreen(editedRange.getSheet());
          }
        }
      }
    }
    
    if(editedRange.getSheet().getName() != 'Start' && editedRange.getValue() == "") {
      //for each (var editedRange in editedRanges) {
      if(editedRange.getBackground() == '#ff0000'){
        editedRange.setValue(randomEmoji());
        editedRange.setBackground(randomColor());
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start").getRange('b10').setValue(startStats[9][0] + 0.1);
      }
      else {
        editedRange.setValue(randomEmoji());
        randomBug(editedRange.getSheet());
        randomBug(editedRange.getSheet());
        //refreshScreen(editedRange.getSheet());
      }
      populateConsole();
    }
    
  }
}

function checkEdit(range, difficulty) {
   if(range.getSheet().getName() != 'Start' && range.getValue() == "") {
     //for each (var editedRange in editedRanges) {
     if(range.getBackground() == '#ff0000'){
       range.setValue(randomEmoji());
       range.setBackground(randomColor());
       SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start").getRange('b10').setValue(difficulty + 0.1);
     }
     else {
       range.setValue(randomEmoji());
       randomBug(range.getSheet());
       randomBug(range.getSheet());
       //refreshScreen(editedRange.getSheet());
     }
     populateConsole();
   }
}

function refreshScreen(sheet){
  if(sheet.getName() != 'Start') {
    for(var i = 3; i < 50; i++) {
      for(var j = 3; j < 50; j++) {
        var currentCell = sheet.getRange(i, j);
        if(currentCell.getBackground() == '#ffffff'){
          //55356, 57088 to 55357, 56831
          //56347 is bug
          //var randomhex = Utilities.formatString('%02x',);
          var emoji = String.fromCharCode(55357, randbetween(56320, 57042));
          currentCell.setValue(emoji);
        }
        else {
          currentCell.setValue('🐛');
        }
      }
    }
  }
}

function setup() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var startPage = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Start");
  
  startPage.getRange("D1").setValue("SETUP");
  
  startPage.getRange("C2:C6").setValue("");
  startPage.getRange("B10").setValue("1");
  
  if(!startPage.getRange('b2').isBlank()) {
    Logger.log("Enable Player 1");
    startPage.getRange("c2").setValue(0);
  }
  if(!startPage.getRange('b3').isBlank()) {
    Logger.log("Enable Player 2");
    startPage.getRange("c3").setValue(0);
  }
  if(!startPage.getRange('b4').isBlank()) {
    Logger.log("Enable Player 3");
    startPage.getRange("c4").setValue(0);
  }
  if(!startPage.getRange('b5').isBlank()) {
    Logger.log("Enable Player 4");
    startPage.getRange("c5").setValue(0);
  }
  if(!startPage.getRange('b6').isBlank()) {
    Logger.log("Enable Player 5");
    startPage.getRange("c6").setValue(0);
  }
  
  for each (var sheet in sheets)
  {
    if(sheet.getName() != "Start"){
      sheet.clear();
    }
  }
  
  var shipSections = getShipSections();
  
  for each (var sheet in shipSections){
    sheet.getRange('A1').setValue("Total Bug Count");
    sheet.getRange('B1').setValue("=Start!D7");
    sheet.getRange('A2').setValue("Console");
    sheet.getRange('D1').setValue("Current Score");
    sheet.getRange('I1').setValue("=Start!C8");
    sheet.hideColumn(sheet.getRange('BA1'));
    for(var i = 3; i < 50; i++) {
      for(var j = 3; j < 50; j++) {
        //55356, 57088 to 55357, 56831
        //var randomhex = Utilities.formatString('%02x',);
        var currentCell = sheet.getRange(i, j);
        var emoji = randomEmoji();
        currentCell.setHorizontalAlignment("center");
        currentCell.setValue(emoji);
        currentCell.setBackground(randomColor());
      }
    }
    randomBug(sheet);
    sheet.setColumnWidths(3, 47, 20);
  }
  
  assignSection();
  populateConsole();
  startPage.getRange("D1").setValue("RUNNING");
}

function randomEmoji() {
  return String.fromCharCode(55357, randbetween(56320, 57042, 56320, 57042));
}

function randomColor() {
  return '#'+Math.floor(Math.random()*16711679).toString(16);
}