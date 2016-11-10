/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Specifies where the call requests are sent
export const arsHost = 'http://ardemo-vm.cloudapp.net';
export const arsPort = '8080';

// If you are deploying in a subdirectory you'll need to updateSpecifies basename if running in a subdirectory or set as "/" if app runs in root
export const basename = '/';

export const analytics = {
  // https://analytics.google.com/
  google: { trackingId: 'UA-XXXXX-X' },
};

export const endpoints = {
  arsRest: `${arsHost}:${arsPort}/api`,
  arsResourceHandler: `${arsHost}:${arsPort}/TemporaryResource.axd`,
  arsDefaultHandler: `${arsHost}:${arsPort}/Default.aspx`,
};
