import '../public/style/main.css'
import '../public/style/main.less'
import logo from '../public/mountain.jpg'
const img = new Image()
img.src = logo
cnosole.log(123)
document.getElementById('imgBox').appendChild(img)

class Author {
  name = "chenkai";
  age = 20;
  email = "1397142107@qq.com";
  info = () => {
    return {
      name: thia.name,
      age: this.age,
      email: this.email
    }
  }
}
module.export = Author;