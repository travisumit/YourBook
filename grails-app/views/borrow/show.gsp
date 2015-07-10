
<%@ page import="yourBook.Borrow" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'borrow.label', default: 'Borrow')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<div id="show-borrow" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
            <div class="ui yellow segment">
				<g:if test="${borrowInstance?.date_borrow}">
					<span id="date_borrow-label" class="property-label"><g:message code="borrow.date_borrow.label" default="Dateborrow" />: </span>
					
						<span class="property-value" aria-labelledby="date_borrow-label"><g:formatDate date="${borrowInstance?.date_borrow}" /></span>

				</g:if>
            </div>
                <div class="ui red segment">

                    <g:if test="${borrowInstance?.due_date}">
					<span id="due_date-label" class="property-label"><g:message code="borrow.due_date.label" default="Duedate" />: </span>
					
						<span class="property-value" aria-labelledby="due_date-label"><g:formatDate date="${borrowInstance?.due_date}" /></span>
					
				</g:if>
			</div>

            <div class="ui green segment">

                <g:if test="${borrowInstance?.book}">
					<span id="book-label" class="property-label"><g:message code="borrow.book.label" default="Book" />: </span>
					
						<span class="property-value" aria-labelledby="book-label"><g:link controller="book" action="show" id="${borrowInstance?.book?.id}">${borrowInstance?.book?.encodeAsHTML()}</g:link></span>
					
				</g:if>
</div>
                <div class="ui blue segment">

                    <g:if test="${borrowInstance?.member}">
					<span id="member-label" class="property-label"><g:message code="borrow.member.label" default="Member" />: </span>
					
						<span class="property-value" aria-labelledby="member-label"><g:link controller="member" action="show" id="${borrowInstance?.member?.id}">${borrowInstance?.member?.encodeAsHTML()}</g:link></span>
				</g:if>

                    </div>

                <div class="ui black segment">

                    <g:if test="${borrowInstance?.returnedDate}">
					<span id="returnedDate-label" class="property-label"><g:message code="borrow.returnedDate.label" default="Returned Date" />: </span>
					
						<span class="property-value" aria-labelledby="returnedDate-label"><g:formatDate date="${borrowInstance?.returnedDate}" /></span>
					
				</g:if>
			</div>

                <div class="ui grey segment">

                    <g:if test="${borrowInstance?.status}">
					<span id="status-label" class="property-label"><g:message code="borrow.status.label" default="Status" />: </span>
					
						<span class="property-value" aria-labelledby="status-label"><g:formatBoolean boolean="${borrowInstance?.status}" /></span>
					
				</g:if>
			</div>
			<g:form url="[resource:borrowInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${borrowInstance}" params='[borrowId:"${borrowInstance.id}",bookName:"${borrowInstance.book.book_title}",memberId:"${borrowInstance.member.id}"]' ><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
