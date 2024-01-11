import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { OrgChart } from "d3-org-chart";
import * as d3 from "d3";
import { Button, Card, Col, Image, Row, Table } from "react-bootstrap";
import ReactDOMServer from "react-dom/server";
import { dummyData } from "../contants/dummy";
import axios from "axios";
import { buildImageForView } from "../contants/global";

export function TreeD3View(props) {
  const getMemberInfoFromAPI = async () => {
    let memberData = await axios.get(`${process.env.REACT_APP_LOCAL_SERVER_URL}api/member`);
    memberData = await memberData.data.data;
    return memberData;
  };

  useEffect(() => {
    /*const data = await d3.csv(
          'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
        );
        //console.log('datadatadatadatadata', data);
        */
    (async () => {
      try {
        const memberData = await getMemberInfoFromAPI();
        //console.log("memberDatamemberDatamemberData", memberData);

        const orgChartObj = new OrgChart()
          .container("#d3Org")
          //.data(data)
          .data(memberData)
          .compact(false)

          //.svgHeight(window.innerHeight - 10)
          .nodeHeight((d) => 340)
          .nodeWidth((d) => {
            if (d.depth == 0) return 330;
            return 330;
          })
          .childrenMargin((d) => 60)
          .compactMarginBetween((d) => 65)
          .compactMarginPair((d) => 60)
          //.neightbourMargin((a, b) => 50)
          .siblingsMargin((d) => 100)
          .buttonContent(({ node, state }) => {
            const buttonData = (
              <Button
                variant="primary"
                className="d-flex px-2 py-0"
                style={{ height: "25px" }}
              >
                <small>
                  {node.data._directSubordinates}&nbsp;
                  {node.children ? `↑` : `↓`}
                </small>
              </Button>
            );
            return `${ReactDOMServer.renderToStaticMarkup(buttonData)}`;
          })
          .linkUpdate(function (d, i, arr) {
            d3.select(this)
              .attr("stroke", (d) =>
                d.data._upToTheRootHighlighted ? "#14760D" : "#2CAAE5"
              )
              .attr("stroke-width", (d) =>
                d.data._upToTheRootHighlighted ? 15 : 1
              );

            if (d.data._upToTheRootHighlighted) {
              d3.select(this).raise();
            }
          })
          .nodeContent(function (d, i, arr, state) {
            /*const svgStr = `<svg width=150 height=75  style="background-color:none"> <path d="M 0,15 L15,0 L135,0 L150,15 L150,60 L135,75 L15,75 L0,60" fill="#2599DD" stroke="#2599DD"/> </svg>`;
            return `
                        <div class="left-top" style="position:absolute;left:-10px;top:-10px">  ${svgStr}</div>
                        <div class="right-top" style="position:absolute;right:-10px;top:-10px">  ${svgStr}</div>
                        <div class="right-bottom" style="position:absolute;right:-10px;bottom:-14px">  ${svgStr}</div>
                        <div class="left-bottom" style="position:absolute;left:-10px;bottom:-14px">  ${svgStr}</div>
                        <div style="font-family: 'Inter'; background-color:#040910;sans-serif; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width
              }px;height:${d.height}px;border-radius:0px;border: 2px solid #2CAAE5">
                           
                           <div class="pie-chart-wrapper" style="margin-left:-10px;margin-top:5px;width:320px;height:300px"></div>
                         
                          <div style="color:#2CAAE5;position:absolute;right:15px;top:-20px;">
                            <div style="font-size:15px;color:#2CAAE5;margin-top:32px"> ${d.data.memberInfo.fullName
              } & ${d.data.spouseInfo.fullName
              }</div>
                            <div style="font-size:10px;"> ${d.data.memberInfo.address || ''
              } </div>
                            <div style="font-size:10px;"> ${d.data.memberId || ''
              } </div>
                            ${d.depth == 0
                ? `                              <br/>
                            <div style="max-width:200px;font-size:10px;">
                              A corporate history of Ian is a chronological account of a business or other co-operative organization he founded.  <br><br>Usually it is produced in written format but it can also be done in audio or audiovisually  
                            </div>`
                : ''
              }
    
                          </div>
    
                          <div style="position:absolute;left:-5px;bottom:10px;">
                            <div style="font-size:10px;color:#2CAAE5;margin-left:20px;margin-top:32px"> Progress </div>
                            <div style="color:#2CAAE5;margin-left:20px;margin-top:3px;font-size:10px;"> 
                              <svg width=150 height=30> </svg>
                              </div>
                          </div>
                        </div>
                        
    `;*/
            const cardData = (
              <Card style={{ width: `330px` }} className="text-center">
                <Card.Body className="m-0 p-1">
                <div className="d-flex gap-1">
                  <Image
                    src={buildImageForView(
                      d.data.memberInfo.photo,
                      d.data.memberInfo.gender,
                      d.data.id
                    )}
                    style={{'height': '150px', 'width': `${d.data.spouseInfo.fullName ? '158px' : '100%'}`}}
                  />
                  {d.data.spouseInfo.fullName && (
                    <Image
                      src={buildImageForView(
                        d.data.spouseInfo.photo,
                        d.data.spouseInfo.gender
                      )}
                      style={{'height': '150px', 'width': '158px'}}
                    />
                  )}
                </div>
                  <Button
                    variant="link"
                    className="mt-0 py-0"
                    title={`${d.data.memberInfo.fullName}${
                      d.data.spouseInfo.fullName ? " & " : ""
                    }${d.data.spouseInfo.fullName}, ${
                      d.data.memberInfo.address
                    }`}
                  >
                    <strong className="text-start text-truncate text-black">{`${
                      d.data.memberInfo.fullName
                    }${d.data.spouseInfo.fullName ? " & " : ""}${
                      d.data.spouseInfo.fullName
                    }`}</strong>
                  </Button>
                  <Table striped bordered hover size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>Legend</th>
                        <th>Member info</th>
                        <th>Spouse info</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Mobile</td>
                        <td>{d.data.memberInfo.mobile}</td>
                        <td>{d.data.spouseInfo.mobile}</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>{d.data.memberInfo.gender ? "Male" : "Female"}</td>
                        <td>{d.data.spouseInfo.gender ? "Male" : "Female"}</td>
                      </tr>
                      <tr>
                        <td>DoB</td>
                        <td>{d.data.memberInfo.dob}</td>
                        <td>{d.data.spouseInfo.dob}</td>
                      </tr>
                      {d.data.memberInfo.dod == null &&
                      !d.data.spouseInfo.dod == null ? (
                        <tr>
                          <td>Dod (if any)</td>
                          <td>{d.data.memberInfo.dod}</td>
                          <td>{d.data.spouseInfo.dod}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={3}>-</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
                <Card.Footer className="text-start">
                  <small className="text-muted">Added on: {d.data.dateUpdated ? d.data.dateUpdated  : 'n/a'}</small>
                </Card.Footer>
              </Card>
            );
            return `${ReactDOMServer.renderToStaticMarkup(cardData)}`;
          });
        orgChartObj.render(); // render chart
      } catch (err) {
        //console.log("Error occured when fetching books");
      }
    })();
  }, []);

  return <div id="d3Org"></div>;
}
