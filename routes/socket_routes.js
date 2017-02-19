var _ = require('lodash');

var judges;
var conections_judge = {};

var last_stats_main;

function saveJudges(_judges) {
    judges = _judges;
};

module.exports = function(server) {

    var io = require('socket.io')(server);


    io.on('connection', function(socket) {
        console.log('a user connected');

        if(!_.isNil(last_stats_main)) {
          io.emit('stats_main', last_stats_main);
        }

        socket.on('disconnect', function() {
            console.log('user disconnected');

            _.forEach(conections_judge, function(value, key) {
                if(_.isEqual(value, socket.id)){
                  io.emit('client_judge_off', key);
                  console.log('judge disconnected')

                  delete conections_judge[key];
                }
            });
        });
        socket.on('client', function(data) {
            console.log('client')
            console.log('socket_id', socket.id);
            console.dir(data);
        });
        socket.on('stats_main', function(data) {
            console.log('stats_main')
            console.dir(data);

            saveJudges(data.judges);

            last_stats_main = data;
            io.emit('stats_main', data);
        });
        socket.on('commands_main', function(data) {
            console.log('commands_main')
            console.dir(data);
            io.emit('commands_main', data);
        });
        socket.on('client_judge', function(data) {
            var _hash = data;
            console.log('client_judge', _hash);

            conections_judge[_hash] = socket.id;

            io.emit('client_judge_on', data);
        });
        socket.on('scores_judge', function(data) {
            console.log('scores_judge');
            console.dir(data);

            io.emit('scores_judge', data);
        });
        socket.on('judge_name', function(data) {
            console.log('judge_name');
            console.dir(data);

            io.emit('judge_name', data);
        });
        socket.on('reload_all', function(data) {
            io.emit('reload_all');
        });
    });



    var interface = {
        getJudges_hashes: function() {
            _hashes = _.mapValues(judges, function(o) {
                return o.hash;
            });
            return _.values(_hashes);

        }
    };

    return interface;
}