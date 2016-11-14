angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $stateParams, $ionicModal, logStatus) {
  $scope.logStatus = logStatus;
})


.controller('HomeCtrl', function($scope, $stateParams, $ionicModal, logStatus) {
  $scope.logStatus = logStatus;
})

.controller('StateCtrl', function($scope, $stateParams, $ionicModal, logStatus) {
  $scope.logStatus = logStatus;
})

.controller('LoginCtrl', function($scope, $stateParams, $ionicModal, Users, Cards, logStatus, currentId) {

  // finduser
  $ionicModal.fromTemplateUrl('templates/modallogin.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modallogin = modal;
  });

  $scope.openModallogin = function() {
    $scope.modallogin.show();
  };
  $scope.closeModallogin = function() {
    $scope.modallogin.hide();
  };

  $scope.finduser = function(login, password) {
    return Users.finduser(login, password) //checkuser returns the userId
      .then(function(response) {

      //tests
      console.log(response);

      //not used for now
      localStorage.setItem('userid', response);
      localStorage.setItem('isLogged', true);

      // change logStatus
      logStatus.isLogged = true;
      // change currentId
      currentId.userId = response;

    }).then(function(response){

      //tests
      console.log(logStatus.isLogged);
      var testid = String(localStorage.getItem('userid'));
      var testStatus = String(localStorage.getItem('isLogged'));
      console.log("local Storage id:" + testid);
      console.log('local Storage status:' + testStatus);

      $scope.closeModallogin();
    })
      .then(undefined, function(error) {
      console.log('ERR services > Users : ', error.message);
    });
  }

})

.controller('CreateCtrl', function($scope, $stateParams, $ionicModal, Users, Cards, logStatus, currentId) {
  // create user
  $ionicModal.fromTemplateUrl('templates/modalcreateuser.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalcreateuser = modal;
  });

  $scope.openModalcreateuser = function() {
    $scope.modalcreateuser.show();
  };
  $scope.closeModalcreateuser = function() {
    $scope.modalcreateuser.hide();
  };

  $scope.createuser = function(login, password) {
    return Users.createuser(login, password)
      .then(function(response) {

      //tests
      console.log("User", user);
      console.log(response);

      //not used yet
      localStorage.setItem('userid', response);
      localStorage.setItem('isLogged', true);

      // change logStatus
      logStatus.isLogged = true;
      // change currentId
      currentId.userId = response;
    }).then(function(response){

      // tests
      console.log(logStatus.isLogged);

      $scope.closeModalcreateuser();
    });
  }
})

.controller('LinkCtrl', function($http, $scope, $stateParams, $ionicModal, Cards, logStatus, currentId, Links,$cordovaGeolocation) {

  $scope.cards = [];

  $scope.currentId = currentId;
  $scope.userid = currentId.userId;
  var userid = currentId.userId;

  $scope.$watch('currentId.userId', function (newVal, oldVal, scope) {
    if(newVal) {
      scope.userid = newVal;
      userid = newVal;
      Cards.all(newVal)
        .then(function(response){
        scope.cards = response;
      })
    }
  });

    var posOptions = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      console.log(lat + '   ' + long);
      $scope.lati = lat;
      $scope.lng = long;
    }, function(err) {
      console.log(err);
    });
    
  // create user
  $ionicModal.fromTemplateUrl('templates/modallinkus.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modallinkus = modal;
  });

  $scope.openModallinkus = function() {

    $scope.$watch('currentId.userId', function (newVal, oldVal, scope) {
      if(newVal) {
        scope.userid = newVal;
        userid = newVal;
        Cards.all(newVal)
          .then(function(response){
          scope.cards = response;
        })
      }
    });

    $scope.modallinkus.show();
  };
  $scope.closeModallinkus = function() {
    $scope.modallinkus.hide();
  };

  $scope.linkus = function(myCardId) {

    var posOptions = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      console.log(lat + '   ' + long);
      $scope.lati = lat;
      $scope.lng = long;
    }, function(err) {
      console.log(err);
    });

    // ici, il faudrait qu'il y ait une boucle qui attende si pending, fermemodal() si success/error
    return Links.createlink(myCardId, userid, $scope.lati ,$scope.lng).
    then(function(response){

      var temp = currentId.userId;
      currentId.userId = 16;
      currentId.userId = temp;
      
      var test = JSON.stringify($http.get("https://link-us-back.herokuapp.com/users/" + userid + "/verifylinkcreation.json"));
      console.log("this is the test: " + test);
      /*
      while (test==="pending"){
        test = JSON.stringify($http.get("https://link-us-back.herokuapp.com/users/" + userid + "/verifylinkcreation.json"));
      }
      if (test==="success"){
        // success message, new link created

        var temp = currentId.userId;
        currentId.userId = 16;
        currentId.userId = temp;
      }
      else{ //test==="error"
        // error message

      }

      */
      $scope.closeModallinkus();
    });

  }
})

.controller('ContactsCtrl', function($scope, $stateParams, $ionicModal, Users, Cards, Contacts, logStatus, currentId) {
  
  Contacts.all(currentId.userId);
  $scope.Contacts = Contacts;
  /*
  $scope.logStatus = logStatus;
  $scope.currentId = currentId;
  $scope.userid = currentId.userId;

  $scope.$watch('currentId.userId', function (newVal, oldVal, scope) {
    if(newVal) {
      $scope.userid = newVal;
      Contacts.all(newVal) //checkuser returns the userId
        .then(function(response) {
        scope.contacts = response;
      })
    }
  });
  */

})


.controller('ContactDetailCtrl', function($scope, $stateParams, Contacts, logStatus) {
  $scope.contact = Contacts.get($stateParams.contactCardId);
  //$scop.loc = Contacts.getloca($scope.contact);
})

.controller('AccountCtrl', function($scope, $stateParams, $ionicModal, Users, Cards, logStatus, currentId) {

  $scope.cards = [];

  $scope.currentId = currentId;
  $scope.userid = currentId.userId;
  var userId = currentId.userId;

  $scope.$watch('currentId.userId', function (newVal, oldVal, scope) {
    if(newVal) {
      // console.log("hey" + newVal);
      scope.userid = newVal;
      userId = newVal;
      Cards.all(newVal) //checkuser returns the userId
        .then(function(response) {
        scope.cards = response;
      })
    }
  });

  $scope.logStatus = logStatus;

  $ionicModal.fromTemplateUrl('templates/modalcreatecard.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalcreatecard = modal;
  });

  // create card
  $scope.openModalcreatecard = function() {
    $scope.modalcreatecard.show();
  };
  $scope.closeModalcreatecard = function() {
    $scope.modalcreatecard.hide();
  };

  $scope.createcard = function(card_name, first_name, last_name, phone_nbr, facebook_link,
                                linkedin_link, email, street, city, postal_code, country, description, picture_url) {

    return Cards.createcard(card_name, first_name, last_name, phone_nbr, facebook_link,
                            linkedin_link, email, street, city, postal_code, country, description, picture_url, userId)
      .then(function(response) {
      $scope.closeModalcreatecard();

      $scope.$watch('currentId.userId', function (newVal, oldVal, scope) { // modification de currrentId.userId -> appelle le callback function
        if(newVal) {
          // console.log("hey" + newVal);
          scope.userid = newVal;
          userId = newVal;
          Cards.all(newVal) //checkuser returns the userId
            .then(function(response) {
            scope.cards = response;
          })
        }
      });

    })
  }

})

.controller('LogoutCtrl', function($scope, $stateParams, $ionicModal, Users, Cards, logStatus, currentId) {
  $scope.logStatus = logStatus;

  $ionicModal.fromTemplateUrl('templates/modallogout.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modallogout = modal;
  });

  // create card
  $scope.openModallogout = function() {
    $scope.modallogout.show();
  };
  $scope.closeModallogout = function() {
    $scope.$watch('currentId.userId', function (newVal, oldVal, scope) { // modification de currrentId.userId -> appelle le callback function
      if(newVal) {
        // console.log("hey" + newVal);
        scope.userid = newVal;
        userId = newVal;
        Cards.all(newVal) //checkuser returns the userId
          .then(function(response) {
          scope.cards = response;
        })
      }
    });

    $scope.modallogout.hide();
  };

  $scope.logout = function() {

    logStatus.isLogged = false;
    currentId.userId = -1;



    $scope.$watch('currentId.userId', function (newVal, oldVal, scope) { // modification de currrentId.userId -> appelle le callback function
      if(newVal) {
        // console.log("hey" + newVal);
        scope.userid = newVal;
        userId = newVal;
        Cards.all(newVal) //checkuser returns the userId
          .then(function(response) {
          scope.cards = response;
        })
      }
    });

    $scope.closeModallogout();
  }
})


.controller('CardDetailCtrl', function($scope, $stateParams, Cards, logStatus) {
  $scope.card = Cards.get($stateParams.cardId);
})


.controller('GeoCtrl', function($scope, $cordovaGeolocation) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation
    .getCurrentPosition(posOptions)

    .then(function (position) {
    var lat  = position.coords.latitude
    var long = position.coords.longitude
    console.log(lat + '   ' + long)
    $scope.lat = lat
    $scope.lng=long
  }, function(err) {
    console.log(err)
  });

  var watchOptions = {timeout : 3000, enableHighAccuracy: false};
  var watch = $cordovaGeolocation.watchPosition(watchOptions);

  watch.then(
    null,

    function(err) {
      console.log(err)
    },

    function(position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log(lat + '' + long)

    }
  );

  watch.clearWatch();

})
