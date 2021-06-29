import React from 'react';
import popoutFlat from "./images/popout-flat.png"
import {Button, Checkbox, FormControlLabel, TextField, Tooltip} from "@material-ui/core";

interface TroveItem {
    littlePrinceItem: {
        title: string,
        largeImageUrl: string,
        language: string,
        smallImageUrl: string,
        format?: string,
        illustrator?: string,
        isbn13?: string,
        narrator?: string,
        "publication-country"?: string,
        "publication-location"?: string,
        publisher?: string,
        quantity?: number,
        translator?: string,
        year?: string,
        files?: string[]
    }
}

function compareTroveItem(a:TroveItem, b:TroveItem) {
    if (a.littlePrinceItem.language >= b.littlePrinceItem.language) {
        return 1
    }
    return -1
}

interface Trove {
    id: string,
    name: string,
    shortName: string,
    items: TroveItem[]
}

interface ShowcaseState {
    troveItems: TroveItem[],
    displayedTroveItems: TroveItem[],
    searchText: string
    onlyDuplicates: boolean
}

interface ShowcaseProps {
    pageHeader: string
    troveUrl: string
    collectionTitle: string
}

class Showcase extends React.Component<ShowcaseProps, ShowcaseState> {

    constructor(props: ShowcaseProps) {
        super(props)
        this.state = {
            troveItems: [],
            displayedTroveItems: [],
            searchText: "",
            onlyDuplicates: false
        }
    }

    componentDidMount() {
        this.fetchTrove().then(trove => {
            console.log(`Got ${trove.items.length} Trove items`)
            this.setState({troveItems: trove.items.sort(compareTroveItem)});
            this.search("", false)
        })
    }

    fetchTrove() {
        return fetch(this.props.troveUrl)
            .then(res => {
                return res.json() as Promise<Trove>
            })
    }

    render() {
        return (
            <div id="main_content_wrap" className="outer">
                <div id="main_content" className="inner">
                    <h1>{this.props.pageHeader}</h1>
                    <p>My collection, painstakingly acquired over the years.</p>

                    <span>
                        <div>
                            <div style={{display: "flex"}}>
                                <div style={{width: "90%"}}>
                                    <TextField label="Search by language, country, or title"
                                               type="search" variant="outlined"
                                        style={{width: "100%"}}
                                        value={this.state.searchText}
                                        onChange={e => this.onSearchTextChanged(e)}
                                        placeholder="Search by language, country, or title"
                                    />
                                </div>
                                <div style={{marginLeft: "20px"}}>
                                    <div style={{float: "left"}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.onlyDuplicates}
                                                    onChange={e => this.onOnlyDuplicatesChanged(e)}
                                                    color="default"
                                                />
                                            }
                                            label={
                                                <Tooltip title="Send me an email at carl@dragnon.com" arrow>
                                                    <div>Show only copies for which I have duplicates (want to make a deal?)</div>
                                                </Tooltip>
                                            }

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p/>
                        <section>
                            Showing {this.state.displayedTroveItems.length} of {this.state.troveItems.length} editions of {this.props.collectionTitle}
                        </section>
                        <p/>
                        <section className="column">
                            {
                                this.state.displayedTroveItems.map((troveItem, index) => {
                                    return this.renderTroveItem(troveItem, index)
                                })
                            }
                        </section>
                    </span>
                </div>
            </div>
        );
    }

    private onSearchTextChanged(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({
            searchText: e.target.value
        });
        this.search(e.currentTarget.value, this.state.onlyDuplicates);
    }

    private onOnlyDuplicatesChanged(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(`only duplicates value is ${e.currentTarget.checked}`)
        this.setState({
            searchText: this.state.searchText,
            onlyDuplicates: e.target.checked
        });
        this.search(this.state.searchText, e.currentTarget.checked);
    }

    private search(searchText: string, onlyDuplicates: boolean) {
        this.setState({
            displayedTroveItems: this.state.troveItems.filter(this.troveItemMatches(searchText, onlyDuplicates))
        })
    }

    private troveItemMatches(searchText: string, onlyDuplicates: boolean) {

        let searchByText = (_: TroveItem) => {
            return true
        }

        if (searchText) {
            searchByText = (troveItem) => {
                return (
                    troveItem.littlePrinceItem.language.toLowerCase().includes(searchText.toLowerCase()) ||
                    troveItem.littlePrinceItem.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    troveItem.littlePrinceItem["publication-country"]?.toLowerCase().includes(searchText.toLowerCase()) ||
                    troveItem.littlePrinceItem["publication-location"]?.toLowerCase().includes(searchText.toLowerCase())
                ) || false
            }
        }

        let searchByDuplicates = searchByText

        if (onlyDuplicates) {
            searchByDuplicates = troveItem => {
                return searchByText(troveItem) && (troveItem.littlePrinceItem.quantity ?? 1) > 1
            }
        }

        return searchByDuplicates
    }

    private renderTroveItem(troveItem: TroveItem, key: any) {
        return <div className="thumbnail" key={key}>
            <a href={troveItem.littlePrinceItem.largeImageUrl}>
                <div style={{position: "relative"}}>
                    <img width="150"
                         src={troveItem.littlePrinceItem.smallImageUrl}
                         title={troveItem.littlePrinceItem.title}
                         alt={troveItem.littlePrinceItem.title}
                    />
                    <div className="caption">{troveItem.littlePrinceItem.language}</div>
                    {
                        troveItem.littlePrinceItem.files?.map(file => {
                            return this.renderExtraFile(file)
                        })
                    }
                </div>
            </a>
        </div>
    }

    private renderExtraFile(file: string) {
        return <div style={{
            position: "absolute",
            right: "0px",
            margin: "-0.8em 1em 0px"
        }}>

            <span style={{bottom: "0px", right: "0px"}}>
                <a href={file}
                   target="_blank"
                   rel="noreferrer">
                    <img src={popoutFlat}
                         title={`Open in new tab: ${file}`}
                         alt="Open"
                         style={{
                             height: "1.3em",
                             width: "1.3em",
                             padding: "0.2em",
                             marginTop: "0.2em",
                             float: "left",
                             opacity: "0.6"
                         }}
                    />
                </a>
            </span>
        </div>
    }
}

export default Showcase;
