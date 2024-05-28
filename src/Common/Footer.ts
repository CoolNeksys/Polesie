import {Component} from '../Abstract/Component';

export class Footer extends Component {
    constructor(parrent: HTMLElement){
        super(parrent, 'div');
        const footmain = new Component(this.root, 'div', ['footer'], '');
        const container = new Component(footmain.root, 'div', ['container']);
        const ftitle = new Component(container.root, 'p', ['ftitle'], '© 1998-2024, СООО «ПП Полесье» (УНП 200652036). Все права защищены.');
        const imgs = new Component(container.root, 'div', ['imgs']);
        const yt = new Component(imgs.root, 'a', null, null, ['href'], ['https://www.youtube.com/c/polesietoys']);
        new Component(yt.root, 'img', null, null, ['src'], ['./assets/yt.webp']);
        const fb = new Component(imgs.root, 'a', null, null, ['href'], ['https://www.facebook.com/polesietoys/']);
        new Component(fb.root, 'img', null, null, ['src'], ['./assets/fb.webp']);
        const ig = new Component(imgs.root, 'a', null, null, ['href'], ['https://www.instagram.com/polesietoys/']);
        new Component(ig.root, 'img', null, null, ['src'], ['./assets/insta.png']);
    }
}
