import React, { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Form, Button, Alert } from "antd";
import FilePicker from "../../_components/filePicker";

function Step4({ moveToNextStep, goBack, formData }: any) {
  const [form] = Form.useForm();
  const [file, setFile] = useState<any>(null);
  const [file2, setFile2] = useState<any>(formData?.trn_upload?.file);
  const [error, seterror] = useState<any>(false);

  const handleFileUpload = (file: any) => {
    setFile(file);
  };
  const handleFileUpload2 = (file: any) => {
    setFile2(file);
  };

  const onFinish = async (values: any) => {
    try {
      if (file.file && file2.file) {
        const obj: any = {
          id_proof: file,
          trn_upload: file2,
        };
        moveToNextStep({ step4Data: obj });
      } else {
        seterror(true);
        setTimeout(() => {
          seterror(false);
        }, 1400);
      }
    } catch (err) {
      console.log("err", err);
      seterror(true);
      setTimeout(() => {
        seterror(false);
      }, 1400);
    }
  };

  return (
    <div className="sellerRegister-stepbox">
      <Container>
        <Row>
          <Col md={4}>
            <Form
              form={form}
              onFinish={onFinish}
              initialValues={{
                id_type: formData?.id_type,
                id_proof: formData?.id_proof,
              }}
            >
              <div className="input-form-label">ID Proof Documents</div>
              <Form.Item name="id_proof">
                <FilePicker onSubmit={handleFileUpload} fileName={file?.file} />
              </Form.Item>
              <div className="input-form-label">TRN Document</div>
              <Form.Item
                name={"trn_upload"}
                rules={[
                  {
                    //  required: true,
                    message: "trn_number is required",
                  },
                ]}
              >
                <FilePicker
                  onSubmit={handleFileUpload2}
                  fileName={file2?.file}
                />
              </Form.Item>
              <Alert
                description={
                  <div>
                    Please ensure that the documents are thoroughly verified
                    before uploading. If there are any issues with the uploaded
                    documents, your account registration will not be processed.
                  </div>
                }
                type="warning"
                closable
              />
              <br />
              {error ? (
                <>
                  <Alert
                    description={
                      <h6 style={{ color: "red" }}>
                        Please select required documents
                      </h6>
                    }
                    type="error"
                  />
                  <br />
                </>
              ) : null}

              <Row>
                <Col md={6} xs={6}>
                  <Button block onClick={() => goBack()} size="large">
                    Back
                  </Button>
                </Col>
                <Col md={6} xs={6}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large">
                      Continue
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col md={8}>
            <div className="sellerRegister-box2">
              <h4 className="sellerRegister-subHeading">4. Upload Documents</h4>
              <div className="sellerRegister-text1">
                <b>ID Proof:</b> Upload the ID Proof which you have selected in
                Step3. you can upload an Image or Pdf of the same. make sure the
                data is clear and readable. if you are uploding image, upload
                good quality images.
                <br /> <br />
                <b>TRN : </b>Upload Your TRN. if you have. you can also upload
                an image or pdf. <br />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Step4;
