import React, {useState, useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Button, Form, FloatingLabel} from 'react-bootstrap';
import { endLoad, startLoad } from '../../../features/loadingSlice';
import {
  clearLoadStatus,
  clearLoaded,
  load,
  edit
} from '../../../features/admin/producerSlice';
import ImgFieldGallery from '../../../components/ImgFieldGallery';
import { useAlert } from 'react-alert';

export default function Edit(){

  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  /* local vars */
  let {id} = useParams();
  
  /* redux states */
  const {
    producer,
    loadStatus,
    editStatus
  } = useSelector(state=>state.admin.producer);

  /* local state  */
  const [imgUploads, setImgUploads] = useState([]);
  const [producerName, setProducerName] = useState('');
  const [producerEmail, setProducerEmail] = useState('');
  const [producerWebsite, setProducerWebsite] = useState('');
  
  /* effects */
  // load producer on page visit
  useEffect(() => {
    dispatch(load(id));
    return () => {
      dispatch(clearLoadStatus());
      dispatch(clearLoaded());
    };
  }, []);
  
  /* load effects */
  // load producer effect
  useEffect(() => {
    switch( loadStatus ) {
    case "loading":
      dispatch(startLoad());
      break;
    case "success":
      dispatch(endLoad());
      setProducerName(producer.name);
      setProducerEmail(producer.email);
      setProducerWebsite(producer.website);
      break;
    case "failed":
      dispatch(endLoad());
      alert.error("Error in loading Producer data from API.");
      navigate('/admin/producers');
      alert;
    }
  }, [loadStatus]);
  // edit producer effect
  useEffect(()=>{
    switch(editStatus) {
    case "loading ": 
      dispatch(startLoad());
      break;
    case "success":
      dispatch(endLoad());
      alert.success('Updated Producer!');  
      navigate('/admin/producers/'+id);
      break;
    case "failed":
      dispatch(endLoad());
      alert.error('error in updating Producer');
      break;
    }
    
  }, [editStatus]);
  /* event handlers */
  const submitHandler = (formEvent) => {
    formEvent.preventDefault();
    let formData = new FormData(formEvent.target);
    dispatch(edit({id, formData}));
  };

  /* render */
  return <>
    <Helmet>
      <title>Edit Producer</title>
    </Helmet>
    <Container fluid>
      <h1>Edit Producer</h1>
      
      <Button 
        variant="secondary" 
        onClick={()=>{navigate(-1);}}
        size="sm"
        className="mx-1 material-icons"
        title="Cancel Edit"
      >
              arrow_back
      </Button><Form onSubmit = {submitHandler}>
        <FloatingLabel
          className="mb-4"
          controlId="producer-create-name"
          label="Name"
        >
          <Form.Control 
            type="text" 
            name="name" 
            placeholder="Name"
            required
            value={producerName}
            onChange={(e)=>setProducerName(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel
          className="mb-4"
          controlId="producer-create-email"
          label="E-mail"
        >
          <Form.Control 
            type="email" 
            name="email" 
            placeholder="E-mail"
            value={producerEmail}
            onChange={(e)=>setProducerEmail(e.target.value)}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          className="mb-4"
          controlId="producer-create-website"
          label="Website"
        >
          <Form.Control 
            type="url" 
            name="website" 
            placeholder="Website"
            value={producerWebsite}
            onChange={(e)=>setProducerWebsite(e.target.value)}
          />
        </FloatingLabel> 
        
        <Form.Group className="mb-4" controlId="createActorImages">
          <Form.Label>Images</Form.Label>
          <Form.Control 
            type="file" 
            multiple 
            name="images" 
            accept="image/*"
            onChange={e=>{setImgUploads(e.target.files);}}
          />
        </Form.Group>

        <Button type="submit">Submit</Button>
        
        {imgUploads.length>0 && (<>
          <h5>Upload Preview</h5>
          <ImgFieldGallery fileList={imgUploads}/>
        </>
        )}
      </Form>
    </Container>
  </>;
}