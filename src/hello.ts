export function Hello() {
    let message: string = 'Hello World';
    console.log(message);
    let toast = document.getElementById('toast');
    toast!.innerHTML = message;
}