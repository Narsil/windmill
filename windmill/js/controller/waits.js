
  //Wait a specified number of milliseconds
  windmill.controller.waits.sleep = function (param_object) { 
    done = function(){
      windmill.controller.continueLoop();
      return true;
    }    
    setTimeout('done()', param_object.milliseconds);
    return true;
  };
  
  //wait for an element to show up on the page
  //if it doesn't after a provided timeout, defaults to 20 seconds
  windmill.controller.waits.forElement = function (param_object) { 
    _this = this;

    var timeout = 20000;
    var count = 0;
    var p = param_object;
    
    if (p.timeout){
      timeout = p.timeout;
    }

    this.lookup = function(){
       if (count >= timeout){
        windmill.controller.continueLoop();
        return false;
      }
      var n = windmill.controller._lookupDispatch(p);
      count += 2500;
      
      this.check(n);
    }
    
    this.check = function(n){   
      if (!n){
        var x = setTimeout(function () { _this.lookup(); }, 2500);
      }
      else{
        windmill.controller.continueLoop();
        return true;
      }
   }
   
   this.lookup();
   
   //waits are going to wait, so I return true
   //Optimally it would return false if it times out, so when it does return false
   //the calling code will jump back up and process the ui accordingly
   return true;
  };
  
  //This is more of an internal function used by wait and click events
  //To know when to try and reattach the listeners
  //But if users wanted this manually they could use it
  windmill.controller.waits.forPageLoad = function (param_object) { 
     _this = this;

    var timeout = 20000;
    var count = 0;
    var p = param_object;
    
    if (p.timeout){
      timeout = p.timeout;
    }
    this.lookup = function(){
       if (count >= timeout){
        windmill.controller.continueLoop();
        return false;
      }
      //var n = windmill.controller._lookupDispatch(p);
      try { var n = windmill.testingApp.document;}
      catch(err) { var n = false; }
      count += 2500;
      this.check(n);
    }
    
    this.check = function(n){   
      if (!n){
        var x = setTimeout(function () { _this.lookup(); }, 2500);
      }
      else{
        //reattach all the listeners etc.
        windmill.loaded();
        return true;
      }
   }
   
   this.lookup();
   return true;
  }
  
  //Turn the loop back on when the page in the testingApp window is loaded
  windmill.controller.waits.forNotTitle = function (param_object) { 
     _this = this;

    var timeout = 20000;
    var count = 0;
    var p = param_object;
    
    if (p.timeout){
      timeout = p.timeout;
    }
    this.lookup = function(){
       if (count >= timeout){
        windmill.controller.continueLoop();
        return false;
      }
      //var n = windmill.controller._lookupDispatch(p);
      try {
        if (windmill.testingApp.document.title == p.title){
          var n = null;
        }
        else { var n = true };
      }
      catch(err){
        n = null;
      }
      count += 2500;
      
      this.check(n);
    }
    
    this.check = function(n){   
      if (!n){
        var x = setTimeout(function () { _this.lookup(); }, 2500);
      }
      else{
        //reattach all the listeners etc.
        fleegix.event.listen(windmill.testingApp, 'onunload', windmill, 'unloaded');
        windmill.controller.continueLoop();
        return true;
      }
   }
   
   this.lookup();
   return true;
  }