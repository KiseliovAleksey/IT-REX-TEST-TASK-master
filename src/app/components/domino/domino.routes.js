/* @ngInject */
export default function routes($stateProvider) {

    $stateProvider
        .state('domino', {
            url: '/domino/',
            template: require('./domino.html'),
            controller: 'DominoController',
            controllerAs: 'domino'
        })

}