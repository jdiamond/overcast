var _ = require('lodash');
var utils = require('../utils');
var scp = require('../scp');
var rsync = require('../rsync');

exports.run = function (args) {
  utils.argShift(args, 'name');
  args.source = args._.shift();
  args.dest = args._.shift();
  args.direction = 'pull';

  if (!args.name) {
    return utils.missingParameter('[instance|cluster|all]', exports.help);
  } else if (!args.source) {
    return utils.missingParameter('[source]', exports.help);
  } else if (!args.dest) {
    return utils.missingParameter('[dest]', exports.help);
  }

  if (utils.argIsTruthy(args.rsync)) {
    rsync.run(args);
  } else {
    scp.run(args);
  }
};

exports.signatures = function () {
  return [
    '  overcast pull [instance|cluster|all] [source] [dest] [options]'
  ];
};

exports.help = function () {
  utils.printArray([
    'overcast pull [instance|cluster|all] [source] [dest]',
    '  Pull a file or directory from an instance or cluster using scp by default, or rsync if'.grey,
    '  the --rsync flag is used. Source is absolute or relative to the home directory,'.grey,
    '  destination can be absolute or relative to the .overcast/files directory. '.grey,
    '',
    '  Any reference to {instance} in the destination will be replaced with the instance name.'.grey,
    '',
    '    Option         | Default'.grey,
    '    --rsync        | false'.grey,
    '    --user NAME    |'.grey,
    '',
    '  Example:'.grey,
    '  Assuming instances "app.01" and "app.02", this will expand to:'.grey,
    '    - .overcast/files/nginx/app.01.myapp.conf'.grey,
    '    - .overcast/files/nginx/app.02.myapp.conf'.grey,
    '  $ overcast pull app /etc/nginx/sites-enabled/myapp.conf nginx/{instance}.myapp.conf'.grey
  ]);
};
