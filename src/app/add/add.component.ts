import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import {CroppedEvent} from 'ngx-photo-editor';
import { ApiService } from '../services/api.service';
import { FunctionsService } from '../services/functions.service';
import { NoticeService } from '../services/notice.service';

import { filter, pairwise } from 'rxjs/operators';



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  imageChangedEvent: any;
  base64: any;
  uploaded : boolean = false
  sub: any;
  product : any;
  products : any;
  infos: any = [];
  images : any = []
  nombre_fois : any = 0;
  previous_url : any;
  totalt: number;
  myCart: any = [];

  constructor( 
    private route : ActivatedRoute,
    private functions : FunctionsService,
    private _sanitizer: DomSanitizer,
    private serviceApi : ApiService,
    private notice : NoticeService,
    private router: Router,
    ) { 
      this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previous_url = events[0].urlAfterRedirects;
        console.log('previous url', this.previous_url);
        console.log('current url', events[1].urlAfterRedirects);
      });
    }

  ngOnInit(): void {
    //console.log(this.base64)
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.product = parseInt(params['id']);
      this.getProduct(this.product);
    });
  }


  totalAmount() {
    this.totalt = 0;
    var test = localStorage.getItem('the_print_cart');
    let arr = JSON.parse(test);
  //  console.log('mon tableau', arr)
  console.log("ici et ici : ", arr)
    if(arr = null){
      for (let i=0;i<arr.length;i++){
        let totalP = 0;
        totalP = arr[i].qte * arr[i].price;
        this.totalt = this.totalt+(arr[i].qte * arr[i].price);
        //console.log('mon i:',i, totalP);
        //console.log('mon total',this.totalt);
      }
    }
    return this.totalt;
  }

  getFormat(){
    var test = localStorage.getItem('is_user_format');
    let arr = JSON.parse(test);
    console.log(arr);
    return arr;
  }


  convertNumber(number){
    return parseInt(number);
  }



  getPanier(){
    var test = localStorage.getItem('the_print_cart');
    this.products = JSON.parse(test);
    //console.log()
    return this.products;
    console.log()
    //this.delivery_points();
  }


  getProduct(product: any) {
       let data = {
      id : product
    }
    this.serviceApi.getDatas("getproduit", data).subscribe( async (da:any)=>{
     // console.log("Mon produit", da.data);
      console.log(da.data[0].photos);
      this.infos = da.data[0];
    })
  }



  
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    this.uploaded = true;

  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event.base64;
    this.images.push(this.base64);
    this.nombre_fois = this.nombre_fois + 1;
    console.log(this.images);
    console.log(this.nombre_fois)
  }

  productGo(id){
    let params = {
      id : id,
    }
    localStorage.setItem("imgData", this.base64);
    localStorage.setItem('temp_image', JSON.stringify(this.images));
    this.functions.goToProduct("/item", params);
  }


  delete(img){
    if(confirm("??tes vous s??r de vouloir supprimer cette image ?")) {
      console.log(img);
      this.images.splice(img, 1);
      this.nombre_fois = this.nombre_fois - 1;
    }
  }

  add_to_cart(product){
    if(this.infos.formats?.length > 0){
/*       if(this.format == null){
        this.notice.showError("Veuillez choisir un format", "Format invalide")
      } */
      //else{
        if(localStorage.getItem('is_user_infos')!=null){
          var test = localStorage.getItem('the_print_cart');
          let arr = JSON.parse(test);
          let data ={
            product : product,
            qte : 1,
            note : localStorage.getItem('is_user_note'),
            format : this.getFormat().name,
            image : this.images,
            price : this.convertNumber(this.getFormat().price),
            id :  'cart_' + Math.random().toString(36).substr(2, 9),
          }
          if(arr==null){
            this.myCart.push(data);
            let json = JSON.stringify(this.myCart);
            localStorage.setItem('the_print_cart', json);
            this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
            //this.router.navigate(['/mon-panier']);
            this.productGo(product.id);
          }
          else{
            arr.push(data);
            let json = JSON.stringify(arr);
            localStorage.setItem('the_print_cart', json);
            this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
            //this.router.navigate(['/mon-panier']);
            this.productGo(product.id);
          }
        }
        else{
              this.checkLogin();
        }
    
     // }
      
    }
    else{
      if(localStorage.getItem('is_user_infos')!=null){
        var test = localStorage.getItem('the_print_cart');
        let arr = JSON.parse(test);
        let data ={
          product : product,
          qte : 1,
          note : localStorage.getItem('is_user_note'),
          format : this.getFormat().name,
          image : this.images,
          price : this.convertNumber(this.getFormat().price),
          id :  'cart_' + Math.random().toString(36).substr(2, 9),
        }
        if(arr==null){
          this.myCart.push(data);
          let json = JSON.stringify(this.myCart);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
          //this.router.navigate(['/mon-panier']);
          this.productGo(product.id);
        }
        else{
          arr.push(data);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
          //this.router.navigate(['/mon-panier']);
          this.productGo(product.id);
        }
      }
      else{
            this.checkLogin();
      }
  
      }
  }


  checkLogin(){
    let data = {
      type : "produit",
      link : "product",
      key :  "id",
      value : this.infos
    }
    localStorage.removeItem('current_url');
    localStorage.setItem('current_url', JSON.stringify(data));
    this.router.navigate(['/connexion']);
  }



  pay(product){
    if(this.infos.formats?.length > 0){
/*       if(this.format == null){
        this.notice.showError("Veuillez choisir un format", "Format invalide")
      } */
      //else{
        if(localStorage.getItem('is_user_infos')!=null){
          var test = localStorage.getItem('the_print_cart');
          let arr = JSON.parse(test);
          let data ={
            product : product,
            qte : 1,
            note : localStorage.getItem('is_user_note'),
            format : this.getFormat().name,
            image : this.images,
            price : this.convertNumber(this.getFormat().price),
            id :  'cart_' + Math.random().toString(36).substr(2, 9),
          }
          if(arr==null){
            this.myCart.push(data);
            let json = JSON.stringify(this.myCart);
            localStorage.setItem('the_print_cart', json);
            this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
            this.router.navigate(['/mon-panier']);
            //this.productGo(product.id);
          }
          else{
            arr.push(data);
            let json = JSON.stringify(arr);
            localStorage.setItem('the_print_cart', json);
            this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
            this.router.navigate(['/mon-panier']);
            //this.productGo(product.id);
          }
        }
        else{
              this.checkLogin();
        }
    
     // }
      
    }
    else{
      if(localStorage.getItem('is_user_infos')!=null){
        var test = localStorage.getItem('the_print_cart');
        let arr = JSON.parse(test);
        let data ={
          product : product,
          qte : 1,
          note : localStorage.getItem('is_user_note'),
          format : this.getFormat().name,
          image : this.images,
          price : this.convertNumber(this.getFormat().price),
          id :  'cart_' + Math.random().toString(36).substr(2, 9),
        }
        if(arr==null){
          this.myCart.push(data);
          let json = JSON.stringify(this.myCart);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
          this.router.navigate(['/mon-panier']);
          //this.productGo(product.id);
        }
        else{
          arr.push(data);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_print_cart', json);
          this.notice.showSuccess("Produit ajout?? au panier avec succ??s", "Mon panier");
          this.router.navigate(['/mon-panier']);
          //this.productGo(product.id);
        }
      }
      else{
            this.checkLogin();
      }
  
      }
  }


}
