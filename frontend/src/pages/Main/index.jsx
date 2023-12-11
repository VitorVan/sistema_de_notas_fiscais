import React, { useState } from "react";

import httpClient from "../../app/services/httpClient";

import { Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

const locale = {
  emptyText: (
    <div className="w-full flex flex-col items-center mt-6 gap-3">
      <div class="ant-empty-image">
        <svg
          width="64"
          height="41"
          viewBox="0 0 64 41"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
            <g fill-rule="nonzero" stroke="#d9d9d9">
              <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                fill="#fafafa"
              ></path>
            </g>
          </g>
        </svg>
      </div>
      <div className="text-gray-300 text-center">Nenhum dado encontrado</div>
    </div>
  ),
};

function Header({ company, address, cnpj }) {
  return (
    <div className="flex justify-between">
      <div>
        <p>
          <strong>Empresa:</strong> {company ? company : "-"}
        </p>
        <p>
          <strong>Endereço:</strong> {address ? address : "-"}
        </p>
        <p>
          <strong>CNPJ:</strong> {cnpj ? cnpj : "-"}
        </p>
      </div>
    </div>
  );
}

function Footer({ total }) {
  return (
    <div className="flex justify-between font-bold">
      <p>Total</p>
      <p>{total}</p>
    </div>
  );
}

function formatTime(seconds) {
  var minutos = Math.floor(seconds / 60);
  var segundos = seconds % 60;

  // Adiciona um zero à esquerda para manter o formato '00'
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  return minutos + " minuto e " + segundos + " segundos";
}

export default function Main() {
  const [data, setData] = useState({});
  const [id, setId] = useState("-");
  const [time, setTime] = useState("-");
  const [model, setModel] = useState("latest");

  const uploadProps = {
    name: "file",
    customRequest: async ({ file, onSuccess, onError }) => {
      setData({});
      setId("-");
      setTime("-");
      try {
        const fmData = new FormData();
        fmData.append("file", file);
        const response = await httpClient.post("/receipt", fmData);
        let newData = response.data.receiptData.predictions[0];
        if (!Array.isArray(response.data.receiptData.predictions[0].menu)) {
          newData.menu = [newData.menu];
        }
        console.log(newData);
        setData(newData);
        setId(response.data.id);
        setTime(response.data.time);
        return onSuccess("ok");
      } catch (error) {
        return onError(error.message);
      }
    },
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`Nota analisada com sucesso!`);
      } else if (info.file.status === "error") {
        message.error(info.file.error);
      }
    },
    maxCount: 1,
    onRemove: () => {
      setData({});
      setId("-");
      setTime("-");
    },
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nm",
    },
    {
      title: "Quantidade",
      dataIndex: "cnt",
    },
    {
      title: "Preço unitário",
      dataIndex: "unit",
    },
    {
      title: "Preço total",
      dataIndex: "price",
      align: "right",
    },
  ];

  return (
    <div className="flex flex-col gap-12 items-center py-16 min-h-screen">
      <h1 className="text-2xl">Leitor de notas fiscais</h1>
      <Upload {...uploadProps} className="w-[210px]">
        <Button icon={<UploadOutlined />}>Faça upload de uma nota</Button>
      </Upload>
      <div className="flex flex-col items-center gap-2">
        <Table
          className="max-w-lg"
          columns={columns}
          dataSource={data.menu ? data.menu : []}
          bordered
          locale={locale}
          title={() => (
            <Header
              company={data.company}
              address={data.address}
              cnpj={data.cnpj}
            />
          )}
          footer={() => (
            <div className="flex flex-col gap-2">
              <Footer total={data.total ? data.total : "-"} />
              <p className="text-xs text-gray-400">ID da nota: {id}</p>
              <p className="text-xs text-gray-400">
                Tempo de carregamento: {time !== "-" ? formatTime(time) : time}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
