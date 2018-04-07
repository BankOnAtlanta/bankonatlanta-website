var repo;
if (!repo) {
    repo = {};
}
var repo = (function (w, $) {

    var Repository = function () {
        var self = this;

        let seedData = [
            {
                'id': 0,
                'name': 'Test0',
                'demo': 'Youth',
                'zip': 30312,
                'service': 'career services',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
            {
                'id': 1,
                'name': 'Test1',
                'demo': 'Youth',
                'zip': 30314,
                'service': 'financial counseling',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
            {
                'id': 2,
                'name': 'Test2',
                'demo': 'Veteran',
                'zip': 30315,
                'service': 'financial counseling',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
            {
                'id': 3,
                'name': 'Test3',
                'demo': 'Veteran',
                'zip': 30318,
                'service': 'financial counseling',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
            {
                'id': 4,
                'name': 'Test4',
                'demo': 'Senior',
                'zip': 30312,
                'service': 'financial counseling',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
            {
                'id': 5,
                'name': 'Test5',
                'demo': 'Senior',
                'zip': 30310,
                'service': 'financial counseling',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
            {
                'id': 6,
                'name': 'Test6',
                'demo': 'Veteran',
                'zip': 30303,
                'service': 'financial counseling',
                'partner': 'Wells Fargo',
                'url': 'www.poop.com',
                'description': 'blah blah blah',
                'productName': 'Hip FInances'
            },
        ]
        self.getData = function(){return seedData};
    }

    var rep = new Repository();
    return {
        getData: function(){
            return rep.getData();
        }
    }
})(window, window.jQuery);