'use strict';

angular.module('dede.version', [
  'dede.version.interpolate-filter',
  'dede.version.version-directive'
])

.value('version', '0.3');
