import { Stats } from 'webpack';
import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';
 
export class Header extends Component {
    constructor(parrent: HTMLElement, private services: TServices){
        super(parrent, 'div');
        const main = new Component(this.root, 'div', ['header'], '');
        const container = new Component(main.root, 'div', ['container']);
        const logo = new Component(container.root, 'img', ['header-logo'], null, ['src'], ['./assets/logo.png']);
        const links = new Component(container.root, 'ul', ['header-links'], '');
        const mlink = new Component(links.root, 'li', null, '<a href="#">Главная</a>');
        const clink = new Component(links.root, 'li', null, '<a href="#goods">Каталог</a>');
        const crlink = new Component(links.root, 'li', null, '<a href="#cart">Корзина</a>');
        const slink = new Component(links.root, 'li', null, '<a href="#history">Статистика</a>');
        if(this.services.authService.user){
            const llink = new Component(links.root, 'li', null, '<a href="#login">Выйти</a>');   
        } else {
            const llink = new Component(links.root, 'li', null, '<a href="#login">Войти</a>'); 
        }

    }
}