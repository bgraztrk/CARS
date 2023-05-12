import React, { useState, useEffect } from "react";
import axios from "axios"; // gerekli apı işlemlerini yapabilmek için kuruldu ve import edildi
import { Button, Checkbox, Form, Input, Modal, Select, Table, Typography, Tag } from 'antd'; // ant design kütüphanesi elementleri
import { CloseOutlined, PlusOutlined, FormOutlined } from '@ant-design/icons'; // ant design ikonları

const { Option } = Select; // ant design select bileşenin içindeki option bileşenini kullanmak için import edildi
const { Title } = Typography; // ant design typography bileşenin içindeki title bileşenini kullanmak için import edildi

const CarList = () => {
  const [carList, setCarList] = useState([]); // boş bir dizi ile başlat ve bunun içine eklemek yapmak için oluşturduğum state
  const [modalOpen, setModalOpen] = useState(false); // başlangıçta false olmasının sebebi açılır pencerenin durumunu takip etmek için oluşturduğum state
  const [brand, setBrand] = useState(""); // araç markasını tutmak için oluşturduğum state
  const [model, setModel] = useState(""); // araç modelini tutmak için oluşturduğum state 
  const [year, setYear] = useState(""); // araç yılını tutmak için oluşturduğum state
  const [color, setColor] = useState(""); // araç rengini tutmak için oluşturduğum state
  const [sunroof, setSunroof] = useState(false); // araç sunroofunu tutmak için oluşturduğum state
  const [isSaving, setIsSaving] = useState(false); //  araç kaydedilirken veya güncellenirken kaydetme işleminin devam edip etmediğini tutmak oluşturduğum state
  const [selectedCar, setSelectedCar] = useState(null); // seçilen aracı tutmak için bir oluşturduğum state
  
  //gerekli bileşen yüklendiğinde çalış ve tekrar tetiklenme olmaması için boş bir dizi verdim
  useEffect(() => {
    fetchData(); //API çağrısı yapıldı ve CarList durumu güncelllendi
  }, []);

  //API çağrısı yapıldı ve elde edilen verileri carList durumuna kaydedildi.
  const fetchData = async () => {
    try {
      //GET isteği yapıldı ve sonuç response değişkenine atıldı
      const response = await axios.get("https://641aefca1f5d999a4456cddd.mockapi.io/cars");
      setCarList(response.data); //API den gelen verileri al ve CarList durumunu güncelle 
    } catch (error) {
      console.error(error);
    }
  };

  //yeni araç ekleme bloğu
  const handleAddCar = async (e) => {
    e.preventDefault(); 
    setIsSaving(true); //yeni araç eklenirken yada güncellenirken yükleme durumunu gösterir
    try {
      //POST isteği yapıldı sonuç response değişkenine atıldı
      const response = await axios.post("https://641aefca1f5d999a4456cddd.mockapi.io/cars", {
        brand,
        model,
        year,
        color,
        sunroof,
      });
      //isteğin durumu kontrol edilir ve istek başarılıysa bu blok çalışır
      if (response.status === 201) {
        const newCar = response.data; //yeni eklenen aracın verileri newcar değişkenini atıldı
        //carlist durumu güncellenildi. prevCarlist yeni eklenen aracı ekler sort yöntemi ise araclarının id'sine göre sıralamasını sağlar ve içerisinde yaptığım işlev eklenen son aracı listenin en başına ekler
        setCarList((prevCarList) => [newCar, ...prevCarList].sort((a, b) => b.id - a.id));
        setBrand(""); //formdaki giriş alanını sıfırlar
        setModel(""); //formdaki giriş alanını sıfırlar
        setYear(""); //formdaki giriş alanını sıfırlar
        setColor(""); //formdaki giriş alanını sıfırlar
        setSunroof(false); //formdaki giriş alanını sıfırlar
        closeModal(); // formu kapatmadan önce sıfırlar
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false); //yükleme durumu sona erdirildi
    }
  };

  //araç silme bloğu
  const handleDelete = async (id) => {
    try {
      //id numarasına göre istek yapıldı ve isteğin sonucunu response değişkenine atıldı
      const response = await axios.delete(`https://641aefca1f5d999a4456cddd.mockapi.io/cars/${id}`);
      //istek OK ise bu bloğu çalıştır
      if (response.status === 200) {
        //carlist dizisini filtrele ve silinen aracın id'si dılında olan araçlardan yeni bir liste oluştur
        const updatedCarList = carList.filter((car) => car.id !== id);
        setCarList(updatedCarList); //updatecarlist ile carlist listesinin durumunu güncelle 
      }
    } catch (error) {
      console.error(error);
    }
  };

  //araç güncelleme bloğu 
  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      //seçilen aracın kimlik numarasına göre API üzerinden bir PUT isteği gönderildi ve sonucu response değişkenine atıldı
      const response = await axios.put(
        `https://641aefca1f5d999a4456cddd.mockapi.io/cars/${selectedCar.id}`,
        {
          brand,
          model,
          year,
          color,
          sunroof,
        }
      );
      //istek OK ise bu bloğu çalıştır
      if (response.status === 200) {
        const updatedCar = response.data; //istek sonucu dönen dataları bu değişkena atıldı
        //carlist döngüye al
        const updatedCarList = carList.map((car) => {
          //eğer döngüdeki aracın kimlik numarası seçilen aracın kimlik numarası ile aynıysa güncellenmiş aracı döndür
          if (car.id === selectedCar.id) {
            return updatedCar;
          }
          return car; //id'ler aynı değilse eski aracı döndür
        });
        setCarList(updatedCarList); //carlist durumunu updatecarlist ile güncelle
        setSelectedCar(null); //seçili aracın güncelleme sonrası seçili olmadığını belirtir
        setBrand(""); //formdaki giriş alanını sıfırlar
        setModel(""); //formdaki giriş alanını sıfırlar
        setYear(""); //formdaki giriş alanını sıfırlar
        setColor(""); //formdaki giriş alanını sıfırlar
        setSunroof(false); //formdaki giriş alanını sıfırlar
        closeModal();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  //araç ekleme veya güncelleme formunu açma bloğu
  const openModal = () => {
    setModalOpen(true);
  };

  //güncellenicek aracın bilgilerini doldurmak için açılan odal penceresi bloğu
  const openUpdateModal = (car) => {
    setSelectedCar(car); //seçilen aracın durumu güncellenildi
    setBrand(car.brand); //seçilen aracın markası güncellenildi
    setModel(car.model); //seçilen aracın modeli güncellenildi
    setYear(car.year); //seçilen aracın yılı güncellenildi
    setColor(car.color); //seçilen aracın rengi güncellenildi
    setSunroof(car.sunroof); //seçilen aracın açılır penceresi güncellenildi
    setModalOpen(true);
  };

  //modal penceresini kapatma bloğu
  const closeModal = () => {
    setSelectedCar(null);
    setBrand("");
    setModel("");
    setYear("");
    setColor("");
    setSunroof(false);
    setModalOpen(false);
  };

  //tablo tanımladım
  const columns = [
    {
      title: 'Araç No',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Marka',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Yıl',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Renk',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Açılır Tavan',
      dataIndex: 'sunroof',
      key: 'sunroof',
      render: (sunroof) => (sunroof ? "Evet" : "Hayır"),
    },
    {
      title: 'İşlemler',
      dataIndex: 'id',
      key: 'actions',
      width: 218,
      render: (id, record) => (
        <div>
          <Button type="primary" danger onClick={() => handleDelete(id)} id="btnDelete">
            Sil<CloseOutlined/>
          </Button>
          <Button type="primary" onClick={() => openUpdateModal(record)}>
            Güncelle<FormOutlined/>
          </Button>
        </div>
      ),
    },
  ];

  const colorOptions = ["Beyaz", "Mavi", "Kırmızı", "Siyah"];

  return (
    <div className="container">

      <Title italic >Araç Yönetim Paneli</Title>
      
      <div className="add-car-container">
        <Button type="primary" id="btnAdd" onClick={openModal}>
          Araç Ekle<PlusOutlined/>
        </Button>      
      </div>

      <Table columns={columns} //tabloda ki sütünları tanımlayan bir dizi alır
          dataSource={carList} //tablonun kullandığı veri kaynağı
          pagination={false} //sayfalama özelliğini kontrol eder
          scroll={{ y: 400 }} // tablonun dikey yönde 400 piksel kaydırma 
          />

      <Modal
        title={selectedCar ? "Araç Güncelle" : "Araç Ekle"}
        visible={modalOpen}
        onCancel={closeModal}
        footer={[
          
          <Button key="cancel" onClick={closeModal}>
            İptal
          </Button>,
          
          <Button
            key="save"
            type="primary"
            onClick={selectedCar ? handleUpdate : handleAddCar}
            loading={isSaving}
            disabled={
              brand === "" ||
              model === "" ||
              year === "" ||
              color === "" ||
              (selectedCar && isSaving)
            }
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>,

        ]}
      >
        <Form
          layout="vertical" // etiketler üstte giriş alanları altta 
          onFinish={selectedCar ? handleUpdate : handleAddCar} // tetiklenecek işlev belirtildi
        >
          <Form.Item
            label="Marka"
            name="brand"
            rules={[{ required: true, message: "Marka alanı zorunludur" }]}
          >
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
          </Form.Item>
          
          <Form.Item
            label="Model"
            name="model"
            rules={[{ required: true, message: "Model alanı zorunludur" }]}
          >
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
          </Form.Item>
          
          <Form.Item
            label="Yıl"
            name="year"
            rules={[{ required: true, message: "Yıl alanı zorunludur" }]}
          >
            <Input value={year} onChange={(e) => setYear(e.target.value)} />
          </Form.Item>
         
          <Form.Item
            label="Renk"
            name="color"
            rules={[{ required: true, message: "Renk alanı zorunludur" }]}
          >
            <Select
              value={color}
              onChange={(value) => setColor(value)}
              placeholder="Renk seçin"
            >
              {colorOptions.map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Açılır Tavan" name="sunroof">
            <Checkbox
              checked={sunroof}
              onChange={(e) => setSunroof(e.target.checked)}
            />
          </Form.Item>
        
        </Form>
      </Modal>
    </div>
  );
};

export default CarList;


