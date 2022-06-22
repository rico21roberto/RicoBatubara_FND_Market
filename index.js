class Product {
    constructor(_sku, _name, _img, _category, _stock, _price) {
        this.sku = _sku;
        this.name = _name;
        this.img = _img;
        this.category = _category;
        this.stock = _stock;
        this.price = _price;
    }
}

class FnB extends Product {
    constructor(_sku, _name, _img, _category, _stock, _price, _expDate) {
        super(_sku, _name, _img, _category, _stock, _price);
        this.expDate = _expDate;
    }
}
class Cart extends Product {
    constructor(_sku,_name,_img,_price,_qty,_subtotal){
    super(_sku,_name,_img, null,null,_price)
        this.qty = _qty
        this.subtotal = _price * _qty
    }    

}


let dbProduct = [
    new Product("SKU-01-123456", "Topi", "https://cdn1-production-images-kly.akamaized.net/wRIF7UgcnVNjJOh-vVZwOtxTgdk=/1200x900/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/2754021/original/029823500_1552891993-foto_HL_topi.jpg", "General", 20, 35000),
    new FnB("SKU-02-654321", "Telur", "https://asset.kompas.com/crops/WYVtX9H9wYlXZDwLmMqHiw2ZJc4=/0x7:740x500/750x500/data/photo/2020/11/13/5fae4aae98da3.jpg", "FnB", 20, 35000, "2022-06-20"),
    new FnB("SKU-03-321456", "Kentang", "https://image-cdn.medkomtek.com/AqKL90eISrf_GbhYtRAuAi9Simc=/640x640/smart/klikdokter-media-buckets/medias/2302888/original/079980300_1547360960-Makan-Kentang-Mentah-ini-Bahayanya-By-success863-Shutterstock.jpg", "FnB", 20, 35000, "2022-07-20"),
    new Product("SKU-04-135642", "Jacket", "https://media.gq.com/photos/616f1e50af7badb1a03350cd/master/w_2000,h_1333,c_limit/Landing-Leathers-A-2-bomber-jacket.jpg", "General", 20, 35000)
];
let count = 4;

const handleSubmit = () => {
    // 1. Mengambil data
    count += 1;
    let form = document.getElementById("form-product")
    let sku = `SKU-${count < 10 ? `0${count}` : count}-${Math.round(Math.random() * 1000000)}`;
    let name = form.elements[0].value;
    let img = form.elements[1].value;
    let category = form.elements[2].value;
    let stock = form.elements[3].value;
    let price = form.elements[4].value;
    let expDate = form.elements[5].value;

    console.log()
    // 2. Proteksi
    if (img == "" || name == "" || category == "null" || stock == "" || price == "") {
        alert("Isi semua data dengan benar")
    } else {
        // 3. Data disimpan kedalam dbProduct
        if (category == "General") {
            dbProduct.push(new Product(sku, name, img, category, parseInt(stock), parseInt(price)))
        } else if (category == "FnB") {
            dbProduct.push(new FnB(sku, name, img, category, parseInt(stock), parseInt(price), expDate))
        }
        // 4. Reset ulang input element
        form.elements[0].value = "";
        form.elements[1].value = "";
        form.elements[2].value = null;
        form.elements[3].value = "";
        form.elements[4].value = "";
        form.elements[5].value = null;
        document.getElementById("expDate").disabled = true;
    }

    printProduct();
}

const printProduct = (data = dbProduct,sku) => {
    document.getElementById("display").innerHTML = data.map((val, idx) => {
       if(sku == val.sku){
        return `<tr>
            <td>${idx + 1}</td>
            <td>${val.sku}</td>
            <td><img src="${val.img}" width="75px"></td>
            <td><input type="text" id="newName" value="${val.name}"/></td>
            <td>${val.category}</td>
            <td><input type="number" id="newStock" value="${val.stock}"/></td>
            <td><input type="number" id="newPrice" value="${val.price}"/></td>
            <td>${val.expDate ? val.expDate : "-"}</td>
            <td><button  type="button" onclick="handleSave('${val.sku}')">Save</button>
                <button type="button" onclick="handleCancel()">Cancel</button>
            </td>
        </tr>`
       }else {
        return `<tr>
        <td>${idx + 1}</td>
        <td id="sku">${val.sku}</td>
        <td><img src="${val.img}" width="75px"></td>
        <td>${val.name}</td>
        <td>${val.category}</td>
        <td>${val.stock.toLocaleString()}</td>
        <td>IDR. ${val.price.toLocaleString('id')}</td>
        <td>${val.expDate ? val.expDate : "-"}</td>
        <td><button  type="button" onclick="handleEdit('${val.sku}')">Edit</button>
            <button type="button" onclick="handleDelete('${val.sku}')">Delete</button>
            <button type="button" onclick="handleBeli('${val.sku}')">Beli</button>
        </td>
    </tr>`


       }
    }).join("");
}

const handleDate = () => {
    console.log(document.getElementById("category").value)
    console.log(document.getElementById("expDate"))
    if (document.getElementById("category").value == "FnB") {
        document.getElementById("expDate").disabled = false;
    } else {
        document.getElementById("expDate").disabled = true;
    }

}

const handleDelete = (sku) => {
    // Cara 1
    // let index = 0;
    // console.log(sku)
    // dbProduct.forEach((val, idx) => {
    //     if (val.sku == sku) {
    //         index = idx
    //     }
    // })

    // Cara 2
    let index = dbProduct.findIndex((val) => val.sku == sku); // output : number
    dbProduct.splice(index, 1);
    printProduct()
}

///////////////// FITUR FILTER /////////////////////

const handleFilter = () => {
    let form = document.getElementById('filter');
    let dataFilter = {
        sku: form.elements[0].value,
        name: form.elements[1].value,
        category: form.elements[2].value,
        price: form.elements[3].value
    }
    console.log(dataFilter);
    let newArr = [];
    dbProduct.forEach((value, idx) => {
        let dataProp = Object.keys(value); // untuk mengambil properti dari value
        let filterProp = Object.keys(dataFilter);
        let filterCheck = [];
        dataProp.forEach((prop) => {
            if (filterProp.includes(prop)) {
                if (dataFilter[prop] && dataFilter[prop] != "null") {
                    if (prop == "sku" || prop == "name") {
                        filterCheck.push(value[prop].includes(dataFilter[prop]));
                    } else {
                        filterCheck.push(value[prop] == dataFilter[prop]);
                    }
                }
            }
        })
        console.log(filterCheck)
        if (!filterCheck.includes(false)) {
            newArr.push(value)
        }
    })

    console.log(newArr)

    // Menampilkan data kedalam html
    printProduct(newArr);
}

const handleReset = () => {
    let form = document.getElementById('filter');
    form.elements[0].value = null;
    form.elements[1].value = null;
    form.elements[2].value = null;
    form.elements[3].value = null;

    printProduct();
}

const handleEdit = (sku) =>{
printProduct(dbProduct,sku);

}
const handleSave = (sku) =>{
  let index = dbProduct.findIndex((val) => val.sku == sku);
    let name1 = document.getElementById("newName").value
    let stock = document.getElementById("newStock").value
    let price = document.getElementById("newPrice").value
    console.log(dbProduct[index].stock)
    dbProduct[index].name = name1
    dbProduct[index].stock = stock
    dbProduct[index].price = price
    //dbProduct[index] = {...dbProduct[index],name1,stock,price}
    printProduct()
}
const handleCancel = () =>{
    printProduct();
}
let cart = []
const handleBeli = (sku) =>{
   
    let index = dbProduct.findIndex((val) => val.sku == sku);
    
    let sku2 = dbProduct[index].sku
    let name2 = dbProduct[index].name
    let img2 = dbProduct[index].img
   // let category2 = dbProduct[index].category
    let qty = 1
    let price2 = dbProduct[index].price
   // let exp2 = dbProduct[index].expDate
    
    let index2 = cart.findIndex((val)=> val.sku == sku)
    if(dbProduct[index].stock == 0){
        alert('stok habis')
        
    }else if(index2 >= 0){
        
        cart[index2].qty += 1
    
        dbProduct[index].stock -= 1
        cart[index2].subtotal = parseInt(cart[index2].qty * cart[index2].price)
    }else{      
        cart.push(new Cart(sku2,name2,img2,price2,qty))
        dbProduct[index].stock -= 1 
    }
        
        console.table(cart)
     
      

    console.log(sku)
    printCartlist()
    
    printProduct()
   
    }
const printCartlist = () =>{
    let html = cart.map((val,idx)=>{
        return `<tr>
        <td><input type="checkbox" id="select[${idx}]" value="${val.sku}" ></td>
        <td id="sku">${val.sku}</td>
        <td><img src="${val.img}" width="75px"></td>
        <td>${val.name}</td>
        <td>${val.price.toLocaleString('id')}</td>
        <td><button type="button" onclick="decre('${val.sku}')">-</button>${val.qty}<button type="button" onclick="incre('${val.sku}')">+</button></td>
        <td>IDR.${val.subtotal.toLocaleString('id')}</td>
        <td>
            <button type="button" onclick="handleDelete2('${val.sku}')">Delete</button>
        </td>
    </tr>`
    
    })
 
    document.getElementById("cartlist").innerHTML = html.join('')
}

const handleDelete2 = (sku) => {
    // Cara 1
    // let index = 0;
    // console.log(sku)
    // dbProduct.forEach((val, idx) => {
    //     if (val.sku == sku) {
    //         index = idx
    //     }
    // })

    // Cara 2
    let index = cart.findIndex((val) => val.sku == sku); // output : number
    let index2 = dbProduct.findIndex((val)=> val.sku == sku)
    dbProduct[index2].stock += cart[index].qty
    
    cart.splice(index, 1);

    printProduct()
    printCartlist()
}
const incre = (sku) =>{
    let index = cart.findIndex((val) => val.sku == sku)
    let index2 = dbProduct.findIndex((val)=> val.sku == sku)
    if(dbProduct[index2].stock == 0){
        alert("stok habis")
    }else{
        cart[index].qty += 1
        dbProduct[index2].stock -= 1
        cart[index].subtotal = cart[index].qty * cart[index].price
    }
    printProduct()
    printCartlist()
}
const decre = (sku) =>{
    let index = cart.findIndex((val) => val.sku == sku)
    let index2 = dbProduct.findIndex((val)=> val.sku == sku)
    if(cart[index].qty == 1){
        cart.splice(index,1)
        dbProduct[index2].stock += 1
        
    }else{
        cart[index].qty -= 1
        dbProduct[index2].stock += 1
        cart[index].subtotal = cart[index].qty * cart[index].price
    }
    printProduct()
    printCartlist()
}

const handleDelCart=()=>{
let check1 = document.getElementById("cartForm")
let check2 = check1.getElementsByTagName("input")
konfir = true
  
konfir = confirm("yakin dihapus")
if(konfir){
for(let i =0;i<check2.length;i++){
    if(check2[i].checked){
        let index = cart.findIndex((val) => val.sku == check2[i].value)
        let index2 = dbProduct.findIndex((val)=> val.sku == check2[i].value)
        dbProduct[index2].stock += cart[index].qty
        cart.splice(index,1)
    }
}
}
printProduct()
printCartlist()
//memeriksa data yang terceklist
//lakukan looping di data cart untuk mencari data yang akan dihapus
}

printProduct();