var MyNamespace = MyNamespace || {};

MyNamespace.helpers = {
    deslug: function(s){
        str = s.replace(/-/g," ");
        return str.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
    }
}

var kidsReportCardApp = angular.module('kidsReportCardApp',['ui.bootstrap']);

kidsReportCardApp.controller('PortalCtrl', function($scope, $http) {
    $scope.deslug = MyNamespace.helpers.deslug;
    $scope.getCKANTagged = function(tag) {
        url = "http://ctdata.org/api/3/action/tag_show?id=" + tag;
        $http.get(url).success(function(data) {
            p = data.result.packages;

            // Sort by Name Ascending (a to z)
            p.sort(function(a,b) {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;
                }
            });
            da = [];
            p.forEach(function(ds) {
                // set these as empty string so we can filter out later if we don't find anything
                var cat = '';
                var subcat = '';
                var tags = ds.tags;
                tags = tags.map(function(t) { return t.name;});

                // We know that we are searching for either headline or secondary,
                // so we just need to check for one
                cat = tags.indexOf("krcHeadline") > -1 ? 'Headline' : 'Secondary';

                // each dataset only has one subcategory
                for(i=0; i<tags.length; i++) {
                    var t = tags[i];
                    if(t == "krcSafe") {
                        subcat = 'safe';
                        break;
                    } else if (t == "krcStrongStable") {
                        subcat = 'strongandstable';
                        break;
                    } else if (t == "krcHealthy") {
                        subcat = 'healthy';
                        break;
                    } else if (t == "krcFutureSuccess") {
                        subcat = 'futuresuccess';
                        break;
                    }
                }

                extras = {};
                ds.extras.forEach(function(e) {
                    extras[e.key] = e;
                });

                if (Object.keys(extras).indexOf("Year") > -1) {
                    // Process year data and get last value
                    year = extras['Year'].value;
                    yearArray = year.split(";");
                    latestYear = yearArray[yearArray.length-1];
                } else {
                    latestYear = "NA";
                }

                $scope.datasets.push({
                    'name': $scope.deslug(ds.name),
                    'link': ds.name,
                    'category': cat,
                    'subcategory': subcat,
                    'description': extras.Description.value,
                    'latestYear': latestYear,
                    'isCollapsed': true
                });
            });
        });
    }

    $scope.categories = [
        {'name': 'Headline Data Sets',
         'cat': 'Headline',
         'isCollapsed': true},
        {'name': 'Secondary Data Sets',
         'cat': 'Secondary',
         'isCollapsed': true}
    ];
    $scope.subcategories = [
        {
            'name': 'Safe',
            'cat': 'safe',
            'catgroup': 'Headline',
            'isCollapsed': true
        },
        {
            'name': 'Strong & Stable',
            'cat': 'strongandstable',
            'catgroup': 'Headline',
            'isCollapsed': true
        },
        {
            'name': 'Healthy',
            'cat': 'healthy',
            'catgroup': 'Headline',
            'isCollapsed': true
        },
        {
            'name': 'Ready for Future Success',
            'cat': 'futuresuccess',
            'catgroup': 'Headline',
            'isCollapsed': true
        },
        {
            'name': 'Safe',
            'cat': 'safe',
            'catgroup': 'Secondary',
            'isCollapsed': true
        },
        {
            'name': 'Strong & Stable',
            'cat': 'strongandstable',
            'catgroup': 'Secondary',
            'isCollapsed': true
        },
        {
            'name': 'Healthy',
            'cat': 'healthy',
            'catgroup': 'Secondary',
            'isCollapsed': true
        },
        {
            'name': 'Ready for Future Success',
            'cat': 'futuresuccess',
            'catgroup': 'Secondary',
            'isCollapsed': true
        }
    ];

    $scope.datasets = []
    $scope.getCKANTagged("krcHeadline");
    $scope.getCKANTagged("krcSecondary");
});
