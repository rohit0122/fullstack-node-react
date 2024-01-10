import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { OrgChart } from "d3-org-chart";
import * as d3 from "d3";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import ReactDOMServer from "react-dom/server";
import { dummyData } from "../contants/dummy";
import axios from "axios";
import { buildImageForView } from "../contants/global";
import { jsPDF } from "jspdf";

var orgChartObj;

export function BootstrapTreeD3View(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  
  useEffect(() => {
    renderD3Chart();
  }, []);

  const getMemberInfoFromAPI = async () => {
    let memberData = await axios.get(`${process.env.REACT_APP_LOCAL_SERVER_URL}api/member`);
    memberData = await memberData.data.data;
    return memberData;
  };



  const manageChartOpenClose = (closed, chartObj) => {
    if(!closed){
      chartObj.expandAll().fit();
    }else{
      chartObj.collapseAll().fit();
    }
    setIsExpanded(closed);

  }

  const manageChartOrientation = (orientation, chartObj) => {
    if(orientation){
      chartObj.layout("left").render().fit();
    }else{
      chartObj.layout("top").render().fit();
    }
    setIsHorizontal(orientation);
  }


  const filterChart = (e) => {
    // Get input value
    const value = e.target.value;
    // Clear previous higlighting
    orgChartObj.clearHighlighting();

    // Get chart nodes
    const data = orgChartObj.data();

    console.log("eeeee", data);
    // Mark all previously expanded nodes for collapse
    data.forEach((d) => (d._expanded = false));

    // Loop over data and check if input value matches any name
    data.forEach((d) => {
      if (
        value != "" &&
        (d.memberInfo.fullName.toLowerCase().includes(value.toLowerCase()) ||
          d.spouseInfo.fullName.toLowerCase().includes(value.toLowerCase()))
      ) {
        // If matches, mark node as highlighted
        d._highlighted = true;
        d._expanded = true;
      }
    });

    // Update data and rerender graph
    orgChartObj.data(data).render().fit();

    console.log("filtering chart", e.target.value);
  };

  const downloadPdf = () => {
    orgChartObj.exportImg({
      save: false,
      full: true,
      onLoad: (base64) => {
        var pdf = new jsPDF();
        var img = new Image();
        img.src = base64;
        img.onload = function () {
          pdf.addImage(
            img,
            "JPEG",
            5,
            5,
            595 / 3,
            ((img.height / img.width) * 595) / 3
          );
          pdf.save("chart.pdf");
        };
      },
    });
  };



  const renderD3Chart = async () => {
    try {
      const memberData = await getMemberInfoFromAPI();
      console.log("memberDatamemberDatamemberData", memberData);

      orgChartObj = new OrgChart()
        .container("#d3Org")
        //.data(data)
        .data(memberData)
        .compact(false)
        .svgHeight(window.innerHeight - 10)
        .nodeHeight((d) => 85 + 25)
        .nodeWidth((d) => 220 + 2)
        .childrenMargin((d) => 50)
        .compactMarginBetween((d) => 35)
        .compactMarginPair((d) => 30)
        .neighbourMargin((a, b) => 20)
        .nodeContent(function (d, i, arr, state) {
          const color = "#FFFFFF";
          const imageDiffVert = 25 + 2;
          return `
            <div style='width:${
              d.width
            }px;height:${d.height}px;padding-top:${imageDiffVert - 2}px;padding-left:1px;padding-right:1px'>
                    <div style="font-family: 'Inter', sans-serif;background-color:${color};  margin-left:-1px;width:${d.width - 2}px;height:${d.height - imageDiffVert}px;border-radius:10px;border: 1px solid #E4E2E9">
                        <div style="display:flex;justify-content:flex-end;margin-top:5px;margin-right:8px">#${
                          d.data.id
                        }</div>
                        <div style="background-color:${color};margin-top:${-imageDiffVert - 20}px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
                        <div style="margin-top:${
                          -imageDiffVert - 20
                        }px;">   
                        <img src="${buildImageForView(d.data.memberInfo.photo, d.data.memberInfo.gender, d.data.id)}" style="margin-left:${12}px;border-radius:100px;width:40px;height:40px;" />
                        <img src="${buildImageForView(
                          d.data.spouseInfo.photo,
                          d.data.spouseInfo.gender,
                          d.data.id
                        )}" style='margin-left:${5}px;border-radius:100px;width:40px;height:40px;' class='${d.data.spouseInfo.fullName ?"" :"d-none"}' />
                        </div>
                        <div style="font-size:15px;color:#08011E;margin-left:10px;margin-top:10px">
                        <span style="color:${d.data.memberInfo.dod ? '#FF0000': '#08011E'}">${d.data.memberInfo.fullName}</span>
                        ${d.data.spouseInfo.fullName ? " & " : ""}<span style="color:${d.data.spouseInfo.dod ? '#FF0000': '#08011E'}">${d.data.spouseInfo.fullName}</span></div>
                        <div style="color:#716E7B;margin-left:10px;margin-top:3px;font-size:10px;" class="text-truncate"> ${
                          d.data.memberInfo.address
                        } </div>

                    </div>
                </div>
                        `;
        });
      orgChartObj.render(); // render chart
    } catch (err) {
      console.log("Error occured when fetching books");
    }
  };
  return (
    <>
      <div className="d-flex gap-1">
        <input
          type="search"
          placeholder="Search by name"
          onChange={(event) => filterChart(event)}
        />
        {/*<Button onClick={() => orgChartObj.fullscreen()}>
        Fit to the screen
      </Button>
      <Button onClick={() => orgChartObj.exportImg()}>Export Current</Button>*/}
        <Button onClick={() => orgChartObj.exportImg({ full: true })}>
          Export Image
        </Button>
        <Button onClick={() => orgChartObj.exportSvg()}>Export SVG</Button>
        <Button onClick={() => downloadPdf(orgChartObj)}>Export PDF</Button>
        <Button onClick={() => manageChartOpenClose(!isExpanded, orgChartObj)}>
        {isExpanded ? 'Open' : 'Close'} All
        </Button>
        <Button onClick={() => manageChartOrientation(!isHorizontal, orgChartObj)}>
         Show {!isHorizontal ? 'Horizontal' : 'Vertical'}
        </Button>
      </div>
      <div id="d3Org"></div>
    </>
  );
}
