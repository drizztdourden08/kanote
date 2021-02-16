import React, { useEffect } from 'react'
import './Main.css';

import {BiDotsVerticalRounded} from 'react-icons/bi';
import {IoMdAddCircle} from 'react-icons/io';

const electron = window.require('electron');
const remote = electron.remote;

var screen = remote.screen;
var mainScreen = screen.getPrimaryDisplay()
const dimensions = mainScreen.size;
const screenWidth = dimensions.width;
console.log(screenWidth);

const Main = () => {
    useEffect(() => {    
      const appWidth = (((300 + 10) * 3));
      console.log(appWidth);
      const centeredX = (screenWidth / 2) - (appWidth / 2);
      console.log(centeredX);
  
      remote.getCurrentWindow().setSize(appWidth, 600);
      remote.getCurrentWindow().setPosition(centeredX, 0);
  
  
    },
    // array of variables that can trigger an update if they change. Pass an
    // an empty array if you just want to run it once after component mounted. 
    [])
    
    return (
      <div className="App">
        <div className="columns">
        <div className="column">
            <div className="column_title">
              <span>Requested</span>
            </div>
            <div className="AddIcon">
              <IoMdAddCircle />
            </div>
            <div className="column_cards">
              <div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                  <BiDotsVerticalRounded />
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div>
              <div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div>
              <div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div>
              <div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="column_title">
              <span>In Progress</span>
            </div>
            <div className="column_cards">
            <div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div><div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="column_title">
              <span>Done</span>
            </div>
            <div className="column_cards">
            <div className="card">
                <div className="card_priority">
                  <span>High</span>
                </div>
                <div className="card_title">
                  <span>Integration of Something</span>
                </div>
                <div className="card_tags">
                  <div className="tag">UX</div>
                  <div className="tag">Design</div>
                  <div className="tag">Subs</div>
                </div>
                <div className="card_content">
  
                </div>
                <div className="card_footer">
                  <div className="card_footer_assignees">
                    <div className="assignee"></div>
                  </div>
                  <div className="card_footer_notes-counter"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Main;