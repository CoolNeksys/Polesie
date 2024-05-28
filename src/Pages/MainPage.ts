import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';


export class MainPage extends Component {
    constructor(parrent: HTMLElement, private services: TServices){
        super(parrent, 'div', ['mainpage']);
        const container = new Component(this.root, 'div', ['container']);
        const mainpage = new Component(container.root, 'div', ['mainp']);
        const maint = new Component (mainpage.root, 'div', ['maint']);
        const maintitle = new Component(maint.root, 'h1', ['maintitle'], '<span>Добро пожаловать в мир детства!</span>');
        const maintext = new Component(maint.root, 'p', ['maintext'], 'Фабрика "Полесье" более 20 лет известна, как производитель высококачественных пластмассовых игрушек. При производстве мы используем только сертифицированное сырье и красители пригодные к контакту с пищевыми продуктами.');
        const clink = new Component(maint.root, 'a', ['clink'], 'Перейти в каталог <span>→</span>', ['href'], ['#goods']);
        const mainimage = new Component(mainpage.root, 'img', ['mainimage'], '');
    }
}