import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';


export class LoginPage extends Component {
    regButton: Component;
    outButton: Component;
    constructor(parrent: HTMLElement, private services: TServices){
        super(parrent, 'div', ["loginpage"]);

        new Component(this.root, 'h1', null, 'Вход');
        this.regButton = new Component(this.root, 'input', ["logbutton"], null, ['type', 'value'], ['button', 'Войти с помощью Google']);
        this.regButton.root.onclick = () => {
            this.services.authService.authWithGoogle();

        }
        this.outButton = new Component(this.root, 'input', ["logbutton"], null, ['type', 'value'], ['button', 'Выйти из приложения']);
        this.outButton.root.onclick = () => {
            this.services.authService.outhFromGoogle();

        };

        
        const user = this.services.authService.user;
        if (user) {
            this.toggleButtons(true);
          } else {
            this.toggleButtons(false);
          }


          this.services.logicService.addListener('userAuth',(isAuthUser) =>{
            if (isAuthUser) {
                this.toggleButtons(true)
            } else {
                this.toggleButtons(false)
            }
          } )
          
        
    }

    toggleButtons(isAuthUser: boolean): void {
     if (isAuthUser) {
        this.regButton.remove();
        this.outButton.render();
     } else {
        this.regButton.render();
        this.outButton.remove();
     }
    }

}