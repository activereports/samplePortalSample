/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import AuthDataProviders from '../../providers/AuthDataProviders';
import LoginForm from '../../components/auth/LoginForm';
import s from './Auth.scss';

const Auth = () => (
  <AuthDataProviders>
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.content}>
            <div className={s.logo}>
              <img src="./branding/portal-auth-logo.png" />
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
  </AuthDataProviders>
);

export default Auth;
