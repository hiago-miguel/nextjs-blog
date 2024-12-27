module.exports = ({ env }) => ({
  level: 'debug', // or 'debug' to get more detailed logs
  transports: [
    new (require('winston')).transports.Console({
      format: require('winston').format.combine(
        require('winston').format.colorize(),
        require('winston').format.simple(),
      ),
    }),
  ],
});
