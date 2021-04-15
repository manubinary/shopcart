import React, {useEffect, useState} from 'react';
import './Home.css';
import {Row, Col} from 'react-bootstrap';
import Checkbox from 'react-simple-checkbox';

function Home() {
  const [itemsList, setItemsList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(()=> {
    return fetch('https://run.mocky.io/v3/fca7ef93-8d86-4574-9a4a-3900d91a283e')
      .then((response) => response.json())
      .then((responseJson) => {
          let length = responseJson.length;
          while ( length --> 0 ) {
              responseJson[ length ].available = responseJson[ length ].quantity === 0 ? false : eval(responseJson[ length ].available.toLowerCase());
              responseJson[ length ].lowOnStock = (responseJson[ length ].quantity > 0 && responseJson[ length ].quantity < 10) ? true : eval(responseJson[ length ].lowOnStock.toLowerCase());
              responseJson[ length ].removed = false;
              responseJson[ length ].checked = false;
          }
          setItemsList(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSelection = (event, productId) => {
    const dataList = [...itemsList];
    const productIds = [...selectedProducts]
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].productId === productId) {
        dataList[i].checked = !dataList[i].checked;
        if (!dataList[i].checked) {
          let index = productIds.indexOf(productId);
          if (index !== -1) {
            productIds.splice(index, 1);
          }
        } else {
          productIds.push(productId);
        }
        break;
      }
    }
    setItemsList(dataList);
    setSelectedProducts(productIds);
  };

  const handleRemoveItems = () => {
    const dataList = [...itemsList];
    for (var i = 0; i < dataList.length; i++) {
      if (dataList[i].checked ) {
        dataList[i].removed = true;
      }
    }
    setItemsList(dataList);
    setSelectedProducts([]);
  };

  const getList = () => {
    const list = [];
    itemsList.forEach((item) => {
      !item.removed && list.push(
        <Col md={3} xs={3} lg={3} sm={3} className="itemContainer" key={item.productId}>
          <div className="item">
            <img className="image" src={item.imageUrl} alt="new" />
            <Checkbox className="selectionCheck" checked={item.checked} size={2} tickAnimationDuration={100} color='#9484da' onChange={(event)=>handleSelection(event, item.productId)} ></Checkbox>
            {item.promotionBadge && <div className="promotion">{item.promotionBadge}</div>}
            <div className="name">{item.name}</div>
            <div><span className="price">£{item.price}</span>&nbsp;&nbsp;<span className="oldPrice">£<s>{item.priceWas}</s></span></div>
            {(item.lowOnStock && item.available) && <div className="lowOnStock">Limited Stock!</div>}
            {item.available && <div className="inStock">{item.quantity} in stock</div>}
            {!item.available && <div className="outOfStock">Out of stock</div>}
          </div>
        </Col>);
    });
    return(list);
  }


  return(
    <div className="mainHome">
      <Row className="mainHeader">
        <Col className="header">
          <h1>Your Cart</h1>
        </Col>
      </Row>
      <div className="mainContent">
        {selectedProducts.length > 0 && <div className="buttonContainer" onClick={() => handleRemoveItems() }>
          Remove {selectedProducts.length} Selected Product{selectedProducts.length > 1 ? 's': '' }
        </div>}
        <Row className="contentList"> {getList()} </Row>
      </div>
    </div>
  )
}

export default Home;
