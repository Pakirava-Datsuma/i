angular.module('app').config(function($stateProvider, statesRepositoryProvider) {
  statesRepositoryProvider.init(window.location.host);
  $stateProvider
    .state('index', statesRepositoryProvider.index())
    .state('index.service', {
      abstract: true,
      url: 'service/{id:int}',
      resolve: {
        // TODO make sure it works stable
        service: function($stateParams, ServiceService) {
          // console.log('App.states: calling get service, $stateParams.id =', $stateParams.id);
          return ServiceService.get($stateParams.id);
        },
        regions: function(PlacesService, service) {
          return PlacesService.getRegionsForService(service);
        }
      },
      views: {
        'main@': {
          templateUrl: 'app/service/index.html',
          controller: 'ServiceFormController'
        }
      }
    })
    .state('index.situation', {
      url: 'subcategory/:catID/:scatID/situation/:sitID',
      resolve: {
        chosenCategory: function(CatalogService, $stateParams) {
          return CatalogService.getCatalogTreeTagService($stateParams.catID, $stateParams.scatID, $stateParams.sitID);
        }
      },
      views: {
        'contentIn': {
          templateUrl: 'app/service/new.situation.html',
          controller: 'SituationController'
        }
      }
    })
    .state('index.newsubcategory', {
      url: 'subcategory/:catID/:scatID',
      resolve: {
        chosenCategory: function(CatalogService, $stateParams) {
          return CatalogService.getCatalogTreeTagService($stateParams.catID, $stateParams.scatID);
        }
      },
      views: {
        'contentIn': {
          templateUrl: 'app/service/subcategory/new.subcategory.html',
          controller: 'NewSubcategoryController'
        }
      }
    })
    .state('index.service.general', {
      url: '/general',
      views: {
        'content': {
          controller: 'ServiceGeneralController'
        }
      }
    })
    .state('index.service.instruction', {
      url: '/instruction',
      views: {
        'content': {
          templateUrl: 'app/service/instruction/instruction.html',
          controller: 'ServiceInstructionController'
        }
      }
    })
    .state('index.service.feedback', {
      url: '/feedback',
      views: {
        'content': {
          templateUrl: 'app/service/feedback/feedback.html',
          controller: 'ServiceFeedbackController'
        }
      }
    })
    .state('index.service.legislation', {
      url: '/legislation',
      views: {
        'content': {
          templateUrl: 'app/service/legislation.html',
          controller: 'ServiceLegislationController'
        }
      }
    })
    .state('index.service.questions', {
      url: '/questions',
      views: {
        'content': {
          templateUrl: 'app/service/questions.html',
          controller: 'ServiceQuestionsController'
        }
      }
    })
    .state('index.service.discussion', {
      url: '/discussion',
      views: {
        'content': {
          templateUrl: 'app/service/discussion.html',
          controller: 'ServiceDiscussionController'
        }
      }
    })
    .state('index.service.statistics', {
      url: '/statistics',
      views: {
        'content': {
          templateUrl: 'app/service/statistics.html',
          controller: 'ServiceStatisticsController'
        }
      }
    })
    .state('index.catalog', {
      url: ':catID',
      resolve : {
        catalogContent : function (CatalogService, $stateParams) {
          return CatalogService.getCatalogTreeTag($stateParams.catID)
        }
      },
        views: {
          'contentIn' : {
            templateUrl: 'app/service/template.services.html',
            controller: 'NewIndexController'
          }
        }
    });
});
