import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { NotificationService } from './shared/messages/notification.service';
import { LoginService } from './security/login/login.service';

@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {

  constructor(private ns: NotificationService,
              private injector: Injector,
              private zone: NgZone) {
    super();
  }

  handleError(errorResponse: HttpErrorResponse | any) {
    if (errorResponse instanceof HttpErrorResponse) {
      const message = errorResponse.error.message;

      // O switch abaixo estava sendo executado fora de uma zona. Com isso o Angular não atualiza os
      // componentes de tela no momento correto. Resolvemos isso com o NgZone. Para tal, basta executar o código do switch com o método run
      // do NgZone e a notificação com o snackbar funcionará conforme o esperado na situação de erro de requisição HTTP.
      this.zone.run(() => {
        switch (errorResponse.status) {
          case 401:
            this.injector.get(LoginService).handleLogin();
            break;
          case 403:
            this.ns.notify(message || 'Não autorizado.');
            break;
          case 404:
            this.ns.notify(message || 'Recurso não encontrado. Verifique o console para mais detalhes.');
            break;
        }
      });
    }
    super.handleError(errorResponse);
  }

}
