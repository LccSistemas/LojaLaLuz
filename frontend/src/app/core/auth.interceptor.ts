import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('sessionId') || generateSessionId();

  let headers = req.headers.set('X-Session-Id', sessionId);

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};

function generateSessionId(): string {
  const sessionId =
    'session_' +
    Math.random().toString(36).substring(2) +
    Date.now().toString(36);
  localStorage.setItem('sessionId', sessionId);
  return sessionId;
}
