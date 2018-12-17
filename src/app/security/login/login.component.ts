import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { NotificationService } from 'app/shared/messages/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './user.model';

@Component({
  selector: 'mt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

loginForm: FormGroup;
navigateTo: string;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private notificationService: NotificationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required])
    });
    this.navigateTo = this.activatedRoute.snapshot.params['to'] || btoa('/'); // btoa é uma função de encoding para base64
  }

  login() {
    this.loginService.login(this.loginForm.value.email,
                            this.loginForm.value.password)
                     .subscribe( // Callback com a resposta (executado em caso de sucesso):
                                 (user: User)                  => this.notificationService.notify(`Bem vindo(a), ${user.name}!`),
                                 // Callback executado em caso de erro:
                                 (response: HttpErrorResponse) => this.notificationService.notify(response.error.message),
                                 // Callback executado após a conclusão do Observable:
                                 ()                            => this.router.navigate([ atob(this.navigateTo)]) // atob é uma função
                                                                                                                 // de decoding de base64
                               );
  }

}
